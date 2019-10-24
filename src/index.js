import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import './index.css';
import './fancy_checkbox.css';
import ChuckFactsManagerMain from './chuck_app';
import EnterApp from './enter_screen';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


function App() {
    console.log('process.env.PUBLIC_URL: ', process.env.PUBLIC_URL);
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route path="/facts">
                    <ChuckFactsManagerMain />
                </Route>
                <Route path="/">
                    <EnterApp />
                </Route>
            </Switch>
        </Router>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
