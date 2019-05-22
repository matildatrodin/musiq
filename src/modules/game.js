import React, {Component} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import '../index.css';

const spotifyApi = new SpotifyWebApi();

class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questionData: this.props.questionData,
            questionArray: [],
            currentQuestion: 0,

        };
        this.setQuestionArray = this.setQuestionArray.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    setQuestionArray = () => {
        let questionArray = [];
        var i;
        for (i = 0; i < this.state.questionData.length; i++){
            questionArray.push({
                "questionId": i,
                "option1": this.state.questionData[i].artist,
                "option2": this.state.questionData[i].relatedArtists[0].name,
                "option3": this.state.questionData[i].relatedArtists[1].name,
                "option4": this.state.questionData[i].relatedArtists[2].name,

            })
        }
        this.setState({
            questionArray: questionArray,
        })
    };

    componentWillMount() {
        this.setQuestionArray();
    }

    handleClick(choice){
        console.log(choice.target.value);
        if (choice.target.value === this.state.questionArray[this.state.currentQuestion].option1
            && this.state.currentQuestion === this.state.questionArray[this.state.currentQuestion].questionId){
            console.log("correct")
        } else {
            console.log("wrong")
        }
        if (this.state.currentQuestion < this.state.questionArray.length){
            this.setState({
                currentQuestion:  this.state.currentQuestion + 1,
            })
        } else {
            console.log("No more questions")
        }
    };


    render() {

        console.log(this.state);

        if (this.state.currentQuestion !== this.state.questionArray.length) {

            return (
                <div>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option1}>{this.state.questionArray[this.state.currentQuestion].option1}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option2}>{this.state.questionArray[this.state.currentQuestion].option2}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option3}>{this.state.questionArray[this.state.currentQuestion].option3}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option4}>{this.state.questionArray[this.state.currentQuestion].option4}</button>
                </div>
            );
        } else {

            return("Quiz is done")
        }
    }
}

export default Game;