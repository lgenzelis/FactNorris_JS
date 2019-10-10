import React from 'react';
import './styles.css';
import './chuck_app.css';
import axios from 'axios';
import './myToast.css';
import toaster from 'toasted-notes';
import undo_arrow from './resources/undo.png'


function ActionButton({isDisabled, onClickHandler, className}) {
    return (
        <button
            disabled={isDisabled}
            onClick={onClickHandler}
            className={className}
        />
    );
}


function ActionsBlock({isDisabled, isStarred, starButtonHandler, deleteButtonHandler}) {
    const deleteButton =
        <ActionButton
            isDisabled={isDisabled}
            onClickHandler={deleteButtonHandler}
            className='icon delete'
        />;
    const starButton =
        <ActionButton
            isDisabled={isDisabled}
            onClickHandler={starButtonHandler}
            className={'icon ' + (isStarred? 'starred' : 'unstarred')}
        />;

    return (
        <>
            <td> {deleteButton} </td>
            <td> {starButton} </td>
        </>
    );
}


class LoadingFact extends React.Component {

    maxNPoints = 4;
    timeBetweenPoints = 200; // milliseconds

    constructor(props) {
        super(props);
        this.state = {loadingNPoints: 0};
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, this.timeBetweenPoints);
    }

    tick = () => {
        this.setState({
            loadingNPoints: (this.state.loadingNPoints + 1) % this.maxNPoints,
        });
    };

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        return 'Loading ' + '.'.repeat(this.state.loadingNPoints);
    }

}


function TextBlock({fact, isStarred, onClickHandler}) {
    let text;
    if (fact !== null) {
        if (isStarred) {
            text = <strong>{fact}</strong>;
        } else {
            text = fact;
        }
    } else {
        text = <LoadingFact />;
    }
    return (
        <td className="textCell">
            <button onClick={onClickHandler}>
                {text}
            </button>
        </td>
    );
}


// This class renders each fact, along with its corresponding action buttons
class ChuckFactContainer extends React.Component {

    constructor(props) {
        super(props);
        this.domRef = React.createRef();
    }

    componentDidMount() {
        // scroll the window so that the fact in visible in the screen
        window.scroll({top: this.domRef.current.offsetTop, behavior: 'smooth'});
    }

    render() {
        return (
            <tr ref={this.domRef}>
                <ActionsBlock
                    isDisabled = {this.props.fact === null}
                    isStarred = {this.props.isStarred}
                    deleteButtonHandler={() => this.props.deleteButtonHandler(this.props.factId)}
                    starButtonHandler={() => this.props.starButtonHandler(this.props.factId)}
                />
                <TextBlock
                    isStarred = {this.props.isStarred}
                    onClickHandler={() => this.props.starButtonHandler(this.props.factId)}
                    fact = {this.props.fact}
                />
            </tr>
        );
    }

}


function NewFactButton({zeroFacts, addNewFact}) {
    const text = (zeroFacts ? 'Add a Chuck Norris fact' : 'Add another Chuck Norris fact');
    return (
        <button
            id="add-fact-button"
            className="block"
            onClick={addNewFact}
        >
            {text}
        </button>
    );
}

function UndoPopup({restoreFact, onClose}) {
    return (
        <button className="toast-button"
            onClick={
                () => {
                    restoreFact();
                    onClose();
                }
            }
        >
            <img id="undo" src={undo_arrow} alt="Undo"/>
            Undo delete
        </button>
    );
}


export default class ChuckFactsManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            facts: [], // each element of facts array is an object whose keys are: factId, fact, isStarred
        };
        this.nFactsRequested = 0;  // I use the TOTAL number of requested facts as the key for currently loading facts
    }

    componentDidMount() {
        // load facts stored in localStorage
        const storedFacts = localStorage['STARRED-CHUCK-FACTS'];
        if (storedFacts !== undefined) {
            this.setState({facts: JSON.parse(storedFacts)});
        }
    }

    errorWhileGettingFact(loadingFactId, errorMsg) {
        console.log('errorWhileGettingFact: ' + errorMsg);
        if (loadingFactId !== undefined) {
            this.deleteFact(loadingFactId);
        }
        const errorMsgRendered =
            <div className="popup">
                <p>
                    <strong>An error has occurred :(</strong>
                </p>
                <p>
                    {errorMsg}
                </p>
            </div>;
        toaster.notify(errorMsgRendered, {
            duration: null, // i.e., don't auto-dismiss
            position: "bottom",
        });
    }

    getFactIdx(facts, factId) {
        for (const i in facts) {
            if (facts.hasOwnProperty(i) && facts[i].factId === factId) {
                return i;
            }
        }
        return -1; // i.e., fact not fount
    }

    restoreFact(fact, idx) {
        this.setState((state) => {
            const newFacts = state.facts.slice();
            newFacts.splice(idx, 0, fact);
            return {facts: newFacts};
        });
    }

    deleteFact = (factId) => {
        this.setState((state) => {
            const newFacts = state.facts.slice();
            const idx = this.getFactIdx(newFacts, factId);
            // check that fact exists, just in case
            if (idx >= 0) {
                const factToDelete = state.facts[idx];
                // if fact is not still loading
                if (factToDelete.fact !== null) {
                    toaster.notify(({onClose}) => (
                        <UndoPopup
                            restoreFact={() => this.restoreFact(factToDelete, idx)}
                            onClose={onClose}
                        />),
                        {
                            duration: 5000,
                            position: "bottom",
                        });
                }
                newFacts.splice(idx, 1);
                if (factToDelete.isStarred) {
                    // if the deleted fact was starred, update localStorage
                    const starredFacts = newFacts.filter(({isStarred}) => isStarred);
                    localStorage.setItem('STARRED-CHUCK-FACTS', JSON.stringify(starredFacts));
                }
                return {facts: newFacts};
            }
        });
    };

    getChuckFact(config, loadingFactId, nAttempts=1) {
        axios.get('https://api.chucknorris.io/jokes/random', config)
            .then(res => {
                console.log(res.data.categories);
                // check whether the fact is new or already known
                if (this.getFactIdx(this.state.facts, res.data.id) === -1) {
                    // update state with the new fact
                    this.setState((state) => {
                        const newFacts = state.facts.slice();
                        // finds the position of the loading fact in the list, so as to insert the new fact in the
                        // same position
                        const idx = this.getFactIdx(newFacts, loadingFactId);
                        // this should never happen
                        if (idx < 0) {
                            this.errorWhileGettingFact(undefined, 'A really unexpected error' +
                                ' has happened. May the gods have mercy on your soul.');
                        } else {
                            newFacts[idx] = {
                                factId: res.data.id,
                                fact: res.data.value,
                                isStarred: false,
                            };
                            return {facts: newFacts};
                        }
                    });
                } else {
                    console.log(`Got an already known fact. Attempted ${nAttempts} times.`);
                    if (nAttempts >= 10) {
                        this.errorWhileGettingFact(
                            loadingFactId,
                            'Max number of attempts reached. It seems that you already know all the facts!');
                    } else {
                        this.getChuckFact(config, loadingFactId,nAttempts + 1);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                this.errorWhileGettingFact(loadingFactId, error.toString());
            });
    }

    addNewFact(loadingFactId) {
        let config = undefined;
        if (!this.props.showNsfwFacts) {
            config = {
                params: {
                    category: 'animal,career,celebrity,dev,fashion,food,history,money,movie,music,' +
                        'political,religion,science,sport,travel',
                }
            }
        }
        this.getChuckFact(config, loadingFactId);
    }

    newFactButtonHandler = () => {
        const loadingFactId = 'loading' + String(this.nFactsRequested);
        this.nFactsRequested++;
        this.setState((state) => ({
                facts:
                    state.facts.concat([{
                        factId: loadingFactId,
                        fact: null,
                        isStarred: false,
                    }]),
            })
        );
        // addNewFact needs to know the id of the corresponding loadingFact, in order to delete it once the fact
        // gets loaded
        this.addNewFact(loadingFactId);
    };

    starButtonHandler = (factId) => {
        this.setState((state) => {
            const newFacts = state.facts.slice();
            const idx = this.getFactIdx(newFacts, factId);
            if (idx >= 0) {
                //to avoid problems with shallow copies of state
                const modifiedFact = Object.assign({}, newFacts[idx]);
                modifiedFact.isStarred = !modifiedFact.isStarred;
                newFacts[idx] = modifiedFact;
                // update local storage, adding the new starred fact or removing the unstarred one
                const starredFacts = newFacts.filter(({isStarred}) => isStarred);
                localStorage.setItem('STARRED-CHUCK-FACTS', JSON.stringify(starredFacts));
                return {facts: newFacts};
            }
        });
    };

    render() {
        const chuckFactsRendered = this.state.facts.map(
            ({factId, fact, isStarred}) =>
                <ChuckFactContainer
                    key={factId}
                    factId={factId}
                    fact={fact}
                    isStarred={isStarred}
                    deleteButtonHandler={() => this.deleteFact(factId)}
                    starButtonHandler={this.starButtonHandler}
                />
        );
        return (
            <div id="chuck-fact-manager">
                <div id="chuck-fact-manager-main-region">
                    <table>
                        <tbody>
                            {chuckFactsRendered}
                        </tbody>
                    </table>
                </div>
                <div id="new-fact-region">
                    <NewFactButton
                        zeroFacts={this.state.facts.length === 0}
                        addNewFact={this.newFactButtonHandler}
                    />
                </div>
            </div>
        );
    }

}
