import React, { Component } from 'react';

class QuizGenerator extends Component {

    constructor(props){
        super(props);

        this.state = {
            tracks: this.props.playlistTracks
        }
    }
    handleClick = () => {
        if (this.props.startGame === false) {
            this.setState({
                clicked: true,
            });
        }
        this.props.moveToGame();
    };

    generateQuiz = () => {
        /* gonna put stuff here that creates the quiz*/
    }

    render() {

        return (
            <div>
                <button onClick={this.generateQuiz}>Generate quiz</button>
                <button onClick={this.handleClick}>Start Quiz</button>
            </div>

        );
    }
}

export default QuizGenerator;
