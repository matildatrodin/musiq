import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
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
            currentPage: 'loginPage'
        }
        this.getNowPlaying = this.getNowPlaying.bind(this);
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


  render() {
        const { loggedIn } = this.state;

      if (loggedIn === false ) {
          return (
              <div className="App">
                  <a href='http://localhost:8888'> Login to Spotify </a>
                  <div>
                      Now Playing: {this.state.nowPlaying.name}
                  </div>
                  <div>
                      <img src={this.state.nowPlaying.albumArt} style={{height: 150}}/>
                  </div>
              </div>
          );
      }

      if (loggedIn === true) {
          return (
              <div className="App">
                  <p>HOMEPAGE</p>
                  <button onClick={this.getNowPlaying}>Press here to see current track</button>
                  <div>
                      Now Playing: {this.state.nowPlaying.name}
                  </div>
                  <div>
                      <img src={this.state.nowPlaying.albumArt} style={{height: 150}}/>
                  </div>
              </div>
          );

      }
  }
}

export default App;
