import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class LoginPage extends Component{

    /* Builds the default state */
    constructor(props){

        // Component inherited state
        super(props);

        // Component specific state
        this.state = {
            pageState = 'login',

        }
    }

    /**
     * Triggers Spotify login
     */
    loginToSpotify = () => {
        // When pressed, will trigger the spotify login function
    }
    
    render() {

        return (
            <div></div>
        );
    }
}