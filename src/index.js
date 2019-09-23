import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import './index.css';
import './fancy_button.css';
import './popups.css';
import Popup from 'react-popup';
import ChuckApp from './chuck_app';


class EnterApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            includeNsfw: false,
        };
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    onCheckboxChange() {
        // pass a function to setState to avoid synchronicity issues
        this.setState((state) => ({includeNsfw: !state.includeNsfw}) );
    }

    render() {
        return (
            <div className="enter-page">
                <img id="dancing_chuck" src="dancing_chuck.gif" alt="Dancing Chuck" height="80"/>
                <div className="enter-main-region">
                    <button
                        onClick={() => this.props.enterChuckApp(this.state.includeNsfw)}
                    >
                        Take me to ChuckFacts!
                    </button>
                    {/*<p className="message">*/}
                        <label htmlFor="include_nsfw" className="toggle">
                            <input
                                type="checkbox"
                                className="toggle__input"
                                id="include_nsfw"
                                onChange={this.onCheckboxChange}
                            />
                            <span className="toggle__label">
                                <span className="toggle__text">Show NSFW facts</span>
                            </span>
                        </label>
                    {/*</p>*/}
                </div>
            </div>
        );
    }

}


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'EnterApp',
            showNsfwFacts: false,
        }
    }

    render() {
        const currentScreenRendered =
            this.state.currentScreen === 'EnterApp' ?
                <EnterApp
                    enterChuckApp={
                        (showNsfwFacts) => this.setState({
                            currentScreen: 'ChuckApp',
                            showNsfwFacts: showNsfwFacts,
                        })
                    }
                />
                :
                <ChuckApp showNsfwFacts={this.state.showNsfwFacts} />;
        return (
           <div>
               <Popup />
               {currentScreenRendered}
            </div>
        );
    }
}


ReactDOM.render(
    <Main />,
    document.getElementById('root')
);
