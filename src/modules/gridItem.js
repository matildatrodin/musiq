import React, { Component } from 'react';
import '../index.css';

class GridItem extends Component {

    constructor(props){
        super(props);

        this.state = {
            playlist: this.props.playlist,
            image: this.props.playlist.image,
            startCreateQuiz: this.props.startCreateQuiz
        };
    }

    handleClick = () => { this.props.moveToCreateQuiz(this.props.playlist); };



    render() {

        return (
            <div>
                <img src={this.state.image} className='Grid-img' style={{height: 150}} onClick={this.handleClick}/>
                <p>{this.state.playlist.playlistName}</p>
            </div>

        );
    }
}

export default GridItem;
