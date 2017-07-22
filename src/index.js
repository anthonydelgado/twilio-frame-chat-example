import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import Chat from './components/chat';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            user: null,
            token: null
        };

        this.fetchTokens();
    }
    fetchTokens () {


        fetch('/token')
            .then((response) => response.json())
            .then((data) => {

                this.setState({
                    user: data.identity,
                    token: data.token
                });

            });

    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1>Example Chat</h1>
                    <Chat channel='la' token={this.state.token}  username={this.state.user} />
                </div>
            </BrowserRouter>
        );
    }
}


ReactDOM.render(<App />, document.querySelector('#app'));
