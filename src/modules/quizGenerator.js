import React, { Component } from 'react';
import '../index.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class QuizGenerator extends Component {

    constructor(props){
        super(props);

        this.state = {
            playlistTracks: [],
            questions: "",
            answers: []
        };

        this.generateQuiz = this.generateQuiz.bind(this);
        this.getTracks = this.getTracks.bind(this);
    }
    handleClick = () => {
        if (this.props.startGame === false) {
            this.setState({
                clicked: true,
            });
        }
        this.props.moveToGame();
    };

    getTracks () {
        spotifyApi.getPlaylistTracks(this.props.chosenPlaylist.playlistId)
            .then((response) => {
                var i;
                for(i =0; i < response.items.length; i++) {
                    this.setState(previous => ({
                        playlistTracks: [...previous.playlistTracks, response.items[i]
                        ]}))
                }
            });
    }

    generateQuiz = () => {
        let questions = [];
        var i;
        for (i = 0; i < this.state.playlistTracks.length; i++){
            questions.push({
                    "artist": this.state.playlistTracks[i].track.artists[0].name,
                    "trackName": this.state.playlistTracks[i].track.name,
                    "songId": this.state.playlistTracks[i].track.id
            });
            console.log(questions);
        }
        return questions;
    };


    render() {
        console.log(this.state);

        return (
            <div>
                <button onClick={this.getTracks}>Get Tracks</button>
                <button onClick={this.generateQuiz}>Generate quiz</button>
                <button onClick={this.handleClick}>Start Quiz</button>
            </div>

        );
    }
}

export default QuizGenerator;
