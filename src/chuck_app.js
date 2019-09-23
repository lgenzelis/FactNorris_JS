import React from 'react';
import './styles.css';
import './popups.css';
import './chuck_app.css';
import axios from 'axios';
import Popup from 'react-popup';


class ChuckFact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            fact: null,
            loadingNPoints: 3,
        };
    }

    errorWhileGettingFact(errorMsg) {
        this.setState({
            error: errorMsg,
            isLoaded: true,
        });
        Popup.alert(errorMsg, 'An error has occurred :(');
    }

    getChuckFact(nAttempts = 1) {
        let config = undefined;
        if (!this.props.showNsfwFacts) {
            config = {
                params: {
                    category: 'animal,career,celebrity,dev,fashion,food,history,money,movie,music,political,religion,science,sport,travel',
                }
            }
        }
        axios.get('https://api.chucknorris.io/jokes/random', config)
            .then(res => {
                console.log(res.data.categories);
                if (this.props.checkAndUpdateKnownIds(res.data.id)) {
                    this.setState({
                        fact: res.data.value,
                        isLoaded: true,
                    });

                }
                else {
                    console.log(`Got an already known fact. Attempted ${nAttempts} times.`);
                    if (nAttempts >= 10) {
                        this.errorWhileGettingFact(
                            'Max number of attempts reached. ' +
                            'It seems that you already know all the facts!');
                    } else {
                        this.getChuckFact(nAttempts + 1);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                this.errorWhileGettingFact(error.toString());
            });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 200);
        this.getChuckFact();
        window.scroll({top: document.body.scrollHeight, behavior: 'smooth'}); // this line gets executed before axios gets a response
    }

    componentDidUpdate() {
        // window.scrollTo(0, document.body.scrollHeight);
        window.scroll({top: document.body.scrollHeight, behavior: 'smooth'});
        // document.body.animate({scrollTop: document.body.scrollHeight}, 8000); //,"fast");
    }

    tick() {
        this.setState({
            loadingNPoints: (this.state.loadingNPoints + 1) % 4,
        });
    }

    render() {
        let fact;
        if (!this.state.isLoaded) {
            fact = 'Loading ' + '.'.repeat(this.state.loadingNPoints);
        } else {
            clearInterval(this.interval);
            this.interval = null;
            if (this.state.error) {
                fact = null;
            } else {
                fact = this.state.fact;
            }
        }
        if (fact) {
            return (
                <li>
                    {/*<strong>*/}
                    {fact}
                    {/*</strong>*/}
                </li>
            );
        }
        else {
            return null;
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

}


export default class ChuckApp extends React.Component {

    knownFactsIds = new Set();

    constructor(props) {
        super(props);
        this.state = {
            factsList: [],
        };
    }

    checkAndUpdateKnownIds (id) {
        const is_new_id = !this.knownFactsIds.has(id);
        if (is_new_id) {
            this.knownFactsIds.add(id);
        }
        return is_new_id;
    }

    addChuckFact() {
        this.setState({
            // I can't use the response id as the key, because for that I would need to know the key *before*
            // making the axios request
            factsList: this.state.factsList.concat(
                <ChuckFact
                    key={this.state.factsList.length}
                    showNsfwFacts={this.props.showNsfwFacts}
                    checkAndUpdateKnownIds={(id) => this.checkAndUpdateKnownIds(id)}
                />),
        });
    }

    render() {
        let buttonText = ( this.state.factsList.length > 0 ? 'Add another Chuck Norris fact' : 'Add a Chuck Norris fact');
        return (
            <div>
                <button
                    id="add_fact_button"
                    onClick={() => this.addChuckFact()}
                >
                    {buttonText}
                </button>
                <button id="add_fact_button_hidden"> {buttonText} </button>   {/*merely to make the layout work as expected*/}
                <div>
                    <ul>
                        {this.state.factsList}
                    </ul>
                </div>
            </div>
        );
    }
}