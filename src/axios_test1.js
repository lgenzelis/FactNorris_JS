import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import request from 'superagent';
import axios from 'axios';


class PersonList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {persons: []};
    }

    componentDidMount () {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
            .then(res => {
                console.log(res);
                const persons = res.data;
                this.setState({persons});
            });
    }

    render() {
        return (
            <ul>
                {this.state.persons.map(person => <li key={person.id}>{person.name}</li>)}
            </ul>
        )
    }


    // request
    //     .get('https://api.chucknorris.io/jokes/random')
    //     // .query({ query: 'Manny' })
    //     // .query({ range: '1..5' })
    //     // .query({ order: 'desc' })
    //     // .set('API-Key', 'foobar')
    //     .set('Accept', 'application/json')
    //     .end((err, resp) => {
    //         console.log(resp);
    //         if (!err) {
    //             this.setState({chuckNorrisJoke: resp.text['value']});
    //         }
    //     });
    // }

    // render() {
    //     return (
    //         <div>
    //             Joke: <div>{this.state.chuckNorrisJoke || 'waiting for response...'}</div>
    //         </div>
    //     );
    // }
}


class PersonForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {name: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const user = {
            name: this.state.name
        };

        axios.post(`https://jsonplaceholder.typicode.com/users`,{user})
            .then(res => {
                console.log(res);
                console.log(res.data);
            });
        this.setState({name: ''});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Person Name:</label>
                <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange} />
                <button type="submit">Add</button>
            </form>
        );
    }
}

function App() {
    return (
        <div>
            <PersonForm />
            <hr />
            <PersonList />
        </div>
    );
}



ReactDOM.render(
    <App />,
    document.getElementById('root')
);
