import React, { Component } from 'react';
import '../index.css';

/*This component simply renders your playlists into a grid*/

class GridItem extends Component {

    constructor(props){
        super(props);

        this.state = {
            playlist: this.props.playlist,
            image: this.props.playlist.image,
            startCreateQuiz: this.props.startCreateQuiz
        };
    }

    /*Sends the chosen playlist to parent App.js*/

    handleClick = () => { this.props.startToCreateQuiz(this.props.playlist); };



    render() {

        return (
            <div className="single">
                <img src={this.state.image} className='playlist' onClick={this.handleClick}/>
                <p>{this.state.playlist.playlistName}</p>
                <p>{'Songs in this playlist: '}{this.state.playlist.no_of_songs}</p>
            </div>

        );
    }
}

export default GridItem;
