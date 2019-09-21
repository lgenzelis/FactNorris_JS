import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './popups.css';
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

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 200);

        axios.get('https://api.chucknorris.io/jokes/random')
            .then(res => {
                console.log(res.data.value);
                this.setState({
                    fact: res.data.value});
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: error.toString()});
                Popup.alert(this.state.error, 'An error has occurred :(');
            })
            .finally( () => {
                this.setState({isLoaded: true});
            });
        // window.scrollTo(0, document.body.scrollHeight);
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


class ChuckApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {factsList: []};
        // this.ref = React.createRef()
    }

    addChuckFact() {
        this.setState({
            factsList: this.state.factsList.concat(<ChuckFact key={this.state.factsList.length} />)
        });
    }

    render(){
        let buttonText = ( this.state.factsList.length > 0 ? 'Add another Chuck Norris fact' : 'Add a Chuck Norris fact');
        return (
            <div>
                <button
                    className="block"
                    id="add_fact_button"
                    onClick={() => this.addChuckFact()}
                >
                    {buttonText}
                </button>
                <button className="block" id="hidden"> {buttonText} </button>   {/*merely to make the layout work as expected*/}
                <div>
                <ul>
                    {this.state.factsList}
                </ul>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
    <div>
        <Popup />
        <ChuckApp />
    </div>,
    document.getElementById('root')
);
