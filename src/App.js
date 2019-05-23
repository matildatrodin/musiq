import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import GridItem from './modules/gridItem';
import QuizGenerator from './modules/quizGenerator';
import Game from './modules/game';
import Language from './modules/language';
import Script from 'react-load-script';

import './index.css';
import spotify_white from './resources/icons/spotify_white.svg';
import background_animation from './resources/animations/background.js'
import {promised} from "q";

const spotifyApi = new SpotifyWebApi();

class App extends Component {
    constructor(props){
        super(props);
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            token: params.access_token,
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlistGrid: [],

            chosenPlaylist: "",
            playlistTracks: [],
            currentTrackId: "7lP1Itp08ETqtjqJRTbmeh",
            deviceId: "",

            questionData: "",

            currentPage: 'homePage',
        };
        this.getNowPlaying = this.getNowPlaying.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.moveToHomePage = this.moveToHomePage.bind(this);
        this.moveToCreateQuiz = this.moveToCreateQuiz.bind(this);
        this.handleLoadSuccess = this.handleLoadSuccess.bind(this);
        this.handleLoadFailure = this.handleLoadSuccess.bind(this);
        this.cb = this.cb.bind(this);
        this.play = this.play.bind(this);

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


    moveToHomePage = () => {
        if (this.state.loggedIn === false) {
            this.setState({
                currentPage: 'homePage',
            });
            console.log('State set to homepage');
        }
    };

    moveToCreateQuiz = (playlist) => {
        this.setState({
            chosenPlaylist: {
                "playlistId": playlist.playlistId,
                "image": playlist.image,
                "playlistName": playlist.playlistName},

            currentPage: 'createQuizPage'

        });

        console.log('State set to createQuizPage');
        console.log(playlist);
        console.log(this.state.chosenPlaylist);
    };

    moveToGame = (questionData) => {
        this.setState({
            questionData: questionData,
            currentPage: 'gamePage',
        });
        console.log('State set to gamePage')
    };


    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                }
            });
        })
    }

    getPlaylist () {
        spotifyApi.getUserPlaylists()
            .then((response) => {
                var i;
                for(i = 0; i < response.items.length; i++) {
                    this.setState(previous => ({
                        playlistGrid: [...previous.playlistGrid, {
                            "playlistId": response.items[i].id,
                            "image": response.items[i].images[0].url,
                            "playlistName": response.items[i].name,
                            "tracksId": response.items[i].tracks
                        }]
                    }))
                }
            });
        return this.state.playlistGrid;
    }

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
            //this.play(device_id);
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


    componentDidMount() {
        this.getPlaylist();
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.handleLoadSuccess();
        };
    }



  render() {
        const { loggedIn } = this.state;
        const { currentPage } = this.state;
        const { playlistGrid } = this.state;

        //console.log(this.state);

      /* Login page */
      if (loggedIn === false ) {
            return (
                <div className="backgroundPicture">

                    <canvas src={background_animation} id="background"></canvas>

                    <div className="backgroundFilter">

                        <div className="float_language">
                            <Language/>
                        </div>

                        <h1 class="logo">musi<span id="q">Q</span></h1>
                        <a class="spotifyButton" href="http://localhost:8888/login"><span>Login with</span><img src={spotify_white} alt="Spotify"/></a>

                    </div>
                </div>
            );
      }

      /* Homepage */
      if (loggedIn === true && currentPage === 'homePage') {

        return (
            <div className="App">
                <Script
                    url="https://sdk.scdn.co/spotify-player.js"
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                />
                <div className="banner">

                    <canvas src={background_animation} id="background">
                        <h1>hello</h1>
                    </canvas>

                    <div className="header">
                        <h1 class="logo">musi<span id="q">Q</span></h1>

                        <div class="user">
                            <img className="profilePic"/>
                            <div className="username">username</div>
                            <Language/>
                        </div>
                    </div>

                    <div className="createQuiz">
                        <a class="buttonCreate" href="http://localhost:8888/login">Create Quiz</a>
                    </div>

                </div>

                <div className="box">

                    <div className="saved">
                        <h2>Saved Quizzes</h2>
                        {/*
                        <div className='quiz-grid'>
                            {quizGrid.map(quiz =>(
                            <GridItem
                                key={quizGrid.quizId}
                                moveToCreateQuiz = {this.moveToCreateQuiz}
                                quiz = {quiz}
                                chosenQuiz = {this.state.chosenQuiz}/>
                            ) )}
                        </div>
                        */}
                    </div>

                    <div className="saved">
                        <h2>Saved Playlists</h2>
                        <div className='playlist-grid'>
                            {playlistGrid.map(playlist =>(
                            <GridItem
                                key={playlistGrid.playlistId}
                                moveToCreateQuiz = {this.moveToCreateQuiz}
                                playlist = {playlist}
                                chosenPlaylist = {this.state.chosenPlaylist}/>
                            ) )}
                        </div>
                    </div>

                </div>

            </div>
        );

      }

      /* Create a quiz page */
      if (loggedIn === true && currentPage === 'createQuizPage'){
          return (
              <div className="App">
                  <img src={this.state.chosenPlaylist.image}/>
                  <p>{this.state.chosenPlaylist.playlistName}</p>
                  <QuizGenerator
                    moveToGame = {this.moveToGame}
                    chosenPlaylist = {this.state.chosenPlaylist}
                    questionData = {this.state.questionData}
                  />
              </div>
          )
      }

      /* Game Page */

      if (loggedIn === true && currentPage === 'gamePage'){
          return (
              <div className="App">
              <Game
                  questionData = {this.state.questionData}
                  play = {this.play}
              />
              </div>
          )
      }
  }

}

export default App;
