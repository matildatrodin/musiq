import react, {Component} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import '../index.css';

const spotifyApi = new SpotifyWebApi();

class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questions: this.props.questions,
            answers: [],
            tracks: []
        }
    }

    getRandomArtist(){
    }



    render(){
        return("");
    }
}

export default Game;