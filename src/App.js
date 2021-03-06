import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import GridItem from './modules/gridItem';
import QuizGenerator from './modules/quizGenerator';
import Game from './modules/game';
import Language from './modules/language';
import Script from 'react-load-script';

import './index.css';
import spotify_white from './resources/icons/spotify_white.svg';
import default_album from './resources/img/default.png';
import background_animation from './resources/animations/background.js'

const spotifyApi = new SpotifyWebApi();
const PORT =  process.env.PORT || 8888;

class App extends Component {
    constructor(props){
        super(props);
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            language: "english",
            token: params.access_token,
            loggedIn: token ? true : false,

            userImage: "",
            userName: "",

            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlistGrid: [],

            chosenPlaylist: { playlistId: "", image: default_album, playlistName: "", no_of_songs: ""},
            playlistChosen: false,
            playlistTracks: [],
            deviceId: "",

            questionData: "",

            currentPage: 'homePage',
        };

        this.getPlaylist = this.getPlaylist.bind(this);
        this.moveToHomePage = this.moveToHomePage.bind(this);
        this.startToCreateQuiz = this.startToCreateQuiz.bind(this);
        this.handleLoadSuccess = this.handleLoadSuccess.bind(this);
        this.handleLoadFailure = this.handleLoadSuccess.bind(this);
        this.cb = this.cb.bind(this);
        this.play = this.play.bind(this);
        this.getUser = this.getUser.bind(this);

    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    /*Gets the user information of the logged in user*/

    getUser(){
        spotifyApi.getMe()
            .then((response) =>{
                this.setState({
                    userImage: response.images[0].url,
                    userName: response.display_name
                });
            })
    }

    /*Moves the user to the homepage*/

    moveToHomePage = () => {
        this.setState({
            currentPage: 'homePage',
            playlistChosen: false,
            chosenPlaylist: { playlistId: "", image: default_album, playlistName: "", no_of_songs: "" }
        });
        console.log('State set to homepage');
    };


    /*Sets the chosen playlist and makes it possible for the user to start the quiz*/

    startToCreateQuiz = (playlist) => {
        this.setState({
            chosenPlaylist: {
                "playlistId": playlist.playlistId,
                "image": playlist.image,
                "playlistName": playlist.playlistName},
                "no_of_songs": playlist.no_of_songs,
            playlistChosen: true

            //currentPage: 'createQuizPage'

        });

        console.log('State set to createQuizPage');
    };

    moveToGame = (questionData) => {
        this.setState({
            questionData: questionData,
            currentPage: 'gamePage',
        });
        console.log('State set to gamePage')
    };

    /*Gets the logged in users playlists*/

    getPlaylist () {
        spotifyApi.getUserPlaylists()
            .then((response) => {
                var i;
                for(i = 0; i < response.items.length && i < 9; i++) {
                    this.setState(previous => ({
                        playlistGrid: [...previous.playlistGrid, {
                            "playlistId": response.items[i].id,
                            "image": response.items[i].images[0].url,
                            "playlistName": response.items[i].name,
                            "no_of_songs": response.items[i].tracks.total,
                            "tracksId": response.items[i].tracks
                        }]
                    }))
                }
            });
        return this.state.playlistGrid;
    }

    /*The code for playing the tracks on your spotify client*/

    handleLoadSuccess() {
        this.setState({ scriptLoaded: true });
        console.log("Script loaded");
        const token = this.state.token;
        const player = new window.Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => {
                    cb(token);
                }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            //this.pla<y(device_id);
            console.log('Ready with Device ID', device_id);

            this.setState({
                deviceId: device_id
            });
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();

    }

    // Plays the current song in the game

    play(songId){
        const token = this.state.token;
        console.log(token);

        fetch("https://api.spotify.com/v1/me/player/play?device_id=" + this.state.deviceId, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"},
            body: JSON.stringify({uris: ["spotify:track:" + songId]}),
        }).catch((error) => {
            console.log(error);
        });
    }


    cb(token) {
        return(token);
    }

    handleScriptCreate() {
        this.setState({ scriptLoaded: false });
        console.log("Script created");
    }

    handleScriptError() {
        this.setState({ scriptError: true });
        console.log("Script error");
    }

    handleScriptLoad() {
        this.setState({ scriptLoaded: true});
        console.log("Script loaded");
    }


    /*When the component App.js is loaded it will:
    * Get the users playlists
    * Get the users details
    * Establish a connection to the users spotify client
    * */
    componentDidMount() {
        this.getPlaylist();
        this.getUser();
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.handleLoadSuccess();
        };
    }



    render() {

        const { loggedIn } = this.state;
        const { currentPage } = this.state;
        const { playlistGrid } = this.state;

        console.log(this.state);

        /* Login page */
        if (loggedIn === false ) {
                return (
                    <div className="backgroundPicture">

                        <canvas src={background_animation} id="background"></canvas>

                        <div className="backgroundFilter">

                            <div className="float_language">
                                <Language
                                    language = {this.state.language}
                                />
                            </div>

                            <h1 className="logo">musi<span id="q">Q</span></h1>
                            <a className="button spotifyButton" href={PORT}><span>Login with</span><img src={spotify_white} alt="Spotify"/></a>

                        </div>
                    </div>
                );
        }

        /* Homepage */
        if (loggedIn === true && currentPage === 'homePage') {

            return (
                <div className="main">
                    <canvas src={background_animation} id="background"></canvas>
                    <Script
                        url="https://sdk.scdn.co/spotify-player.js"
                        onCreate={this.handleScriptCreate.bind(this)}
                        onError={this.handleScriptError.bind(this)}
                        onLoad={this.handleScriptLoad.bind(this)}
                    />
                    <div className="banner">

                        <div className="header">

                            <h1 className="logo">musi<span id="q">Q</span></h1>

                            <div className="user">
                                <img className="userPic" src={this.state.userImage}/>
                                <div className="username">{this.state.userName}</div>
                                <Language/>
                            </div>
                        </div>

                    </div>

                    <div className="box">

                        <div className="box_area">
                            <h2>Your Playlists</h2>
                            <div className='playlists'>
                                {playlistGrid.map(playlist =>(
                                <GridItem
                                    key={playlistGrid.playlistId}
                                    startToCreateQuiz = {this.startToCreateQuiz}
                                    playlist = {playlist}
                                    chosenPlaylist = {this.state.chosenPlaylist}/>
                                ) )}
                            </div>
                        </div>

                        <div className="box_area">
                            <h2>Quiz generator</h2>
                            <div className="create">
                                <div className="chosen_info">
                                    <img className="chosenPlaylist" src={this.state.chosenPlaylist.image} />
                                    <p>{this.state.chosenPlaylist.playlistName}</p>
                                </div>
                                {this.state.playlistChosen === true && <QuizGenerator
                                    moveToGame = {this.moveToGame}
                                    chosenPlaylist = {this.state.chosenPlaylist}
                                    playlistChosen = {this.state.playlistChosen}
                                    questionData = {this.state.questionData}
                                    />
                                }
                            </div>
                        </div>

                    </div>

                </div>
            );

        }
        /* Game Page */

        if (loggedIn === true && currentPage === 'gamePage'){
            return (
                <div className="game">
                    
                    <canvas src={background_animation} id="background"></canvas>

                    <div className="navBar" id="quizBar">
                        <div className="quizTitle">{this.state.chosenPlaylist.playlistName}</div>
                        <div className="user">
                            <img className="userPic" src={this.state.userImage}/>
                            <div className="username">{this.state.userName}</div>
                        </div>
                    </div>

                    <Game
                    questionData = {this.state.questionData}
                    play = {this.play}
                    moveToHomePage = {this.moveToHomePage}
                    />
                </div>
            )
        }

    }

}

export default App;
