import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import GridItem from './modules/gridItem';
import './index.css';

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
            playlist: [],
            currentPage: 'homePage',
            startCreateQuiz: false
        }
        this.getNowPlaying = this.getNowPlaying.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.moveToHomePage = this.moveToHomePage.bind(this);

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

    moveToCreateQuiz = () => {
        this.setState({
            currentPage: 'createQuizPage',
        })
        console.log('State set to quizPage')
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
                console.log(response);
                var i;
                for(i = 0; i < response.items.length; i++) {
                    this.setState(previous => ({
                        playlist: [...previous.playlist, {
                            "image": response.items[i].images[0].url,
                            "playlistId": response.items[i].id,
                            "playlistName": response.items[i].name
                        }]
                    }))
                }
            });
        return this.state.playlist;
    }

    componentDidMount() {
        this.getPlaylist();
    }

  render() {
        const { loggedIn } = this.state;
        const { currentPage } = this.state;
        const { playlist } = this.state;

      /* Login page */
      if (loggedIn === false ) {
<<<<<<< HEAD
            return (
                <div className="backgroundPicture">
                    <a class="button" href="http://localhost:8888">Login to Spotify </a>
                </div>
            );
      }

      /* Homepage */
      if (loggedIn === true) {
=======
          return (
              <div className="App">
                  <a href='http://localhost:8888/login'> Login to Spotify </a>
              </div>
          );
      }

      if (loggedIn === true && currentPage === 'homePage') {

>>>>>>> 5da4161c230b0e7a41f5270106a3ee9fd45f780d
          return (
              <div className="App">
                  <p>HOMEPAGE</p>
                  <div className='playlist-grid'>
                      {playlist.map(playlist =>(
                      <GridItem
                          createQuiz = {this.props.startCreateQuiz}
                          moveToCreateQuiz = {this.moveToCreateQuiz}
                          playlist = {playlist}/>
                      ) )}
                  </div>
              </div>
          );

      }

      if (loggedIn === true && currentPage === 'createQuizPage'){
          return (
              <div className="App">
                  <p>Hejhej</p>
              </div>
          )
      }
  }

}

export default App;
