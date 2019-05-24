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
            questionData: [],
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
        if (this.state.amountOfQuestions < 1){
            console.log("You need to have at least 1 question")
        } else {
            this.generateQuizData();
        }
    }

    changeAmount(){
        this.setState({quizReady: false})
    }


    getTracks (chosenPlaylist) {

        if (this.state.playlistTracks.length > 0) {
            this.setState({
                playlistTracks: []

            });
        }

        spotifyApi.getPlaylistTracks(chosenPlaylist.playlistId)
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
        this.getTracks(this.props.chosenPlaylist);
    };



    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            chosenPlaylist: nextProps.chosenPlaylist,
            playlistTracks: [],

        });
        this.getTracks(nextProps.chosenPlaylist);
    }

    render() {

        console.log(this.state);

        if(this.state.quizReady === false) {

            return (
                <div>
                    <form className="create_step" onSubmit={this.handleSubmit}>
                        <label>Number of Questions</label>
                        <input type="text" name="amountOfQuestions" value={this.state.amountOfQuestions} onChange={this.handleChange}/>
                        <input class="button buttonCreate" type="submit" value="Submit"/>
                    </form>
                </div>

            );
        }

        if(this.state.quizReady === true) {

            return (
                <div className="create_step">
                    <p>Your quiz is ready</p>
                    <button class="buttonCreate" onClick={this.changeAmount}>Edit</button>
                    <button class="buttonCreate" onClick={this.handleClick}>Start Quiz</button>
                </div>

            );
        }
    }
}

export default QuizGenerator;
