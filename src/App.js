import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import GridItem from './modules/gridItem';
import QuizGenerator from './modules/quizGenerator';
import Game from './modules/game';
import Language from './modules/language';

import './index.css';
import spotify_white from './resources/icons/spotify_white.svg';
import background_animation from './resources/animations/background.js'

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
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlistGrid: [],

            chosenPlaylist: "",
            playlistTracks: [],

            questionData: "",

            currentPage: 'homePage',
        };
        this.getNowPlaying = this.getNowPlaying.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.moveToHomePage = this.moveToHomePage.bind(this);
        this.moveToCreateQuiz = this.moveToCreateQuiz.bind(this);

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
            })
            console.log('State set to homepage');
        };
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
        })
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

    componentDidMount() {
        this.getPlaylist();
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
              />
              </div>
          )
      }
  }

}

export default App;
