import React, {Component} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import '../index.css';

const spotifyApi = new SpotifyWebApi();

class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questions: this.props.questions,
        };
    }




    render(){

        console.log(this.state);

        return(
            <button>Start Game</button>
        );
    }
}

export default Game;