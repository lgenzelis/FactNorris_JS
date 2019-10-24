import dancing_chuck from "./resources/dancing_chuck.gif";
import React from "react";
import {useHistory} from "react-router-dom";
import {localStorageManager} from "./utils";

function ScreenPresentation({showNsfwFacts, onCheckboxChange}) {
    const history = useHistory(); // hook: new in React Router V5
    return (
        <div className="enter-page">
            <img src={dancing_chuck} alt="Dancing Chuck" height="80"/>
            <div className="enter-main-region">
                <button
                    className="block"
                    onClick={() =>
                        history.push ({
                            pathname: "/facts",
                            search: 'show_nsfw=' + String(showNsfwFacts)
                        })
                    }
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


export default class EnterApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNsfwFacts: false,
        }
    }

    componentDidMount() {
        if (localStorageManager.loadFromLocalStorage('SHOW-NSFW-FACTS') === 'true') {
            // this line gets executed if the key 'SHOW-NSFW-FACTS' is in localStorage AND if its value is 'true'
            this.setState({showNsfwFacts: true});
        }
    }

    showNsfwCheckBoxChangeHandler = () => {
        const showNsfwFacts = !this.state.showNsfwFacts;
        this.setState({showNsfwFacts: showNsfwFacts});
        localStorageManager.saveToLocalStorage('SHOW-NSFW-FACTS', String(showNsfwFacts));
    };

    render() {
        return (
            <ScreenPresentation
                showNsfwFacts={this.state.showNsfwFacts}
                onCheckboxChange={this.showNsfwCheckBoxChangeHandler}
            />
        );
    }
}
