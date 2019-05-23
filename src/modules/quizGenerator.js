import React, { Component } from 'react';
import '../index.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class QuizGenerator extends Component {

    constructor(props){
        super(props);

        this.state = {
            playlistTracks: [],
            relatedArtists: "",
            questionData: "",
            amountOfQuestions: 0,
            playlistChosen: this.props.playlistChosen,
            chosenPlaylist: this.props.chosenPlaylist,
            quizReady: false
        };

        this.generateQuizData = this.generateQuizData.bind(this);
        this.getTracks = this.getTracks.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.getRelatedArtist = this.getRelatedArtist.bind(this);



    }

    handleClick = () => { this.props.moveToGame(this.state.questionData); };

    handleChange(event){
        this.setState({amountOfQuestions: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        this.generateQuizData();
    }

    changeAmount(){
        this.setState({quizReady: false})
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

    getRelatedArtist(artistId){
        let relatedArtists = [];

        spotifyApi.getArtistRelatedArtists(artistId)
            .then((response) =>{
                var i;
                for (i = 0; i < response.artists.length; i++){
                    relatedArtists.push({
                        "name" : response.artists[i].name
                    })
                }
            });
        return (relatedArtists);
    }





    generateQuizData = () => {
        let questionData = [];
        var i;
        for (i = 0; i < this.state.playlistTracks.length && i < this.state.amountOfQuestions; i++){

            questionData.push({
                    "artist": this.state.playlistTracks[i].track.artists[0].name,
                    "trackName": this.state.playlistTracks[i].track.name,
                    "songId": this.state.playlistTracks[i].track.id,
                    "artistId": this.state.playlistTracks[i].track.artists[0].id,
                    "relatedArtists": this.getRelatedArtist(this.state.playlistTracks[i].track.artists[0].id)
            });
        }
        this.setState({
            questionData: questionData,
            quizReady: true
        });

    };

    componentDidMount() {
        this.getTracks();
    };


    render() {

        console.log(this.state);

        if(this.state.quizReady === false) {

            return (
                <div>
                    <form className="create_step" onSubmit={this.handleSubmit}>
                        <label>Number of Questions</label>
                        <input type="text" name="amountOfQuestions" value={this.state.amountOfQuestions} onChange={this.handleChange}/>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>

            );
        }

        if(this.state.quizReady === true) {

            return (
                <div>
                    <p>Your quiz is ready</p>
                    <button onClick={this.changeAmount}>Edit</button>
                    <button onClick={this.handleClick}>Start Quiz</button>
                </div>

            );
        }
    }
}

export default QuizGenerator;
