import React, {Component} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import '../index.css';

const spotifyApi = new SpotifyWebApi();

class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questionData: this.props.questionData,
            questionArray: [],

        };
        this.setQuestionArray = this.setQuestionArray.bind(this);
    }

    setQuestionArray = () => {
        let questionArray = [];
        var i;
        for (i = 0; i < this.state.questionData.length; i++){
            questionArray.push({
                "option1": this.state.questionData[i].artist,
                "option2": this.state.questionData[i].relatedArtists[0],
                "option3": this.state.questionData[i].relatedArtists[1],
                "option4": this.state.questionData[i].relatedArtists[2],

            })
        }
        this.setState({
            questionArray: questionArray,
        })
    };

    componentDidMount() {
        this.setQuestionArray();
    }


    render(){

        console.log(this.state);

        return(
            <button>Start Game</button>
        );
    }
}

export default Game;