import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class GridItem extends Component {
    handleClick = () => {
        if (this.props.startCreateQuiz === false) {
            this.setState({
                clicked: true,
            });
        }
        this.props.moveToCreateQuiz();
    };

    render() {
        const image = this.props.playlist.image;
        console.log(this.props.playlist);

        return (
            <div>
                <img src={image} className='Grid-img' onClick={this.handleClick} style={{height: 150}} />
                <p>{this.props.playlist.playlistName}</p>
            </div>

        );
    }
}

export default GridItem;
