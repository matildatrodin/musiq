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
            amountOfQuestions: 0,
            quizReady: false
        };

        this.generateQuiz = this.generateQuiz.bind(this);
        this.getTracks = this.getTracks.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick = () => { this.props.moveToGame(this.state.questions); };

    handleChange(event){
        this.setState({amountOfQuestions: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        this.generateQuiz();
    }


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
        for (i = 0; i < this.state.playlistTracks.length && i < this.state.amountOfQuestions; i++){
            questions.push({
                    "artist": this.state.playlistTracks[i].track.artists[0].name,
                    "trackName": this.state.playlistTracks[i].track.name,
                    "songId": this.state.playlistTracks[i].track.id
            });
            console.log(questions);
        }
        this.setState({
            questions: questions,
            quizReady: true
        });

    };

    componentDidMount() {
        this.getTracks();
    };


    render() {

        console.log(this.state);

        if(this.state.quizReady == false) {

            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Amount of questions:
                            <input type="text" name="amountOfQuestions" value={this.state.amountOfQuestions}
                                   onChange={this.handleChange}/>
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>

            );
        }

        if(this.state.quizReady == true) {

            return (
                <div>
                    <p>Your quiz is ready</p>
                    <button onClick={this.handleClick}>Start Quiz</button>
                </div>

            );
        }
    }
}

export default QuizGenerator;
