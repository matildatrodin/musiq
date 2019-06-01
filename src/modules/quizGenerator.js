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
    /*Renders the game in App.js*/

    handleClick = () => { this.props.moveToGame(this.state.questionData); };

    /*Changes the amount of questions after the user input*/

    handleChange(event){
        this.setState({amountOfQuestions: event.target.value});
    }

    /*Generates the quiz data when the user has chosen an amount of questions and submitted
    * Will not generate quiz data if amount of questions are < 1
    * */

    handleSubmit(event){
        event.preventDefault();
        if (this.state.amountOfQuestions < 1){
            console.log("You need to have at least 1 question")
        } else {
            this.generateQuizData();
        }
    }

    /*Sets the quiz-status to not ready so that the user can change the amount of questions*/

    changeAmount(){
        this.setState({quizReady: false})
    }


    /*Gets the tracks from the chosen playlist*/

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

    /*Gets related artists for the quiz answer options*/

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



    /*Takes the chosen playlist-tracks and creates data for questions.*/

    generateQuizData = () => {
        let questionData = [];
        var i;
        for (i = 0; i < this.state.playlistTracks.length && i < this.state.amountOfQuestions; i++){

            questionData.push({
                    "artist": this.state.playlistTracks[i].track.artists[0].name,
                    "trackName": this.state.playlistTracks[i].track.name,
                    "songId": this.state.playlistTracks[i].track.id,
                    "artistId": this.state.playlistTracks[i].track.artists[0].id,
                    "playlistImage": this.state.chosenPlaylist.image,
                    "relatedArtists": this.getRelatedArtist(this.state.playlistTracks[i].track.artists[0].id)
            });
        }
        this.setState({
            questionData: questionData,
            quizReady: true
        });

    };

    /*When the quizGenerator component has been loaded, it will automatically get the tracks from the
    * chosen playlist*/

    componentDidMount() {
        this.getTracks(this.props.chosenPlaylist);
    };


    /*If the user changes playlist, the componend will replace the previous fetched tracks with the tracks
    * from the new chosen playlist
    * */

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
