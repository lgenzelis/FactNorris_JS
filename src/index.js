import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import './index.css';
import './fancy_checkbox.css';
import dancing_chuck from './resources/dancing_chuck.gif'
import ChuckFactsManager from './chuck_app';


function EnterApp({showNsfwFacts, onEnterButtonClick, onCheckboxChange}) {
    return (
        <div className="enter-page">
            <img src={dancing_chuck} alt="Dancing Chuck" height="80"/>
            <div className="enter-main-region">
                <button
                    className="block"
                    onClick={onEnterButtonClick}
                >
                    Take me to ChuckFacts!
                </button>
                <label htmlFor="include_nsfw" className="toggle">
                    <input
                        type="checkbox"
                        className="toggle__input"
                        id="include_nsfw"
                        checked={showNsfwFacts}
                        onChange={onCheckboxChange}
                    />
                    <span className="toggle__label">
                        <span className="toggle__text">Show NSFW facts</span>
                    </span>
                </label>
            </div>
        </div>
    );
}


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'EnterApp',
            showNsfwFacts: false,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('SHOW-NSFW-FACTS') === 'true') {
            // this line gets executed if the key 'SHOW-NSFW-FACTS' is in localStorage AND if its value is 'true'
            this.setState({showNsfwFacts: true});
        }
    }

    showNsfwCheckBoxChangeHandler = () => {
        const showNsfwFacts = !this.state.showNsfwFacts;
        this.setState({showNsfwFacts: showNsfwFacts});
        localStorage.setItem('SHOW-NSFW-FACTS', String(showNsfwFacts));
    };

    enterButtonClickHandler = () => {
        this.setState({currentScreen: 'ChuckApp'});
    };

    render() {
        return (
            this.state.currentScreen === 'EnterApp' ?
                <EnterApp
                    showNsfwFacts={this.state.showNsfwFacts}
                    onCheckboxChange={this.showNsfwCheckBoxChangeHandler}
                    onEnterButtonClick={this.enterButtonClickHandler}
                />
            :
                <ChuckFactsManager showNsfwFacts={this.state.showNsfwFacts}/>
        );
    }
}


ReactDOM.render(
    <Main />,
    document.getElementById('root')
);
