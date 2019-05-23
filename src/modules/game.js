import React, {Component} from 'react';
import '../index.css';


class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questionData: this.props.questionData,
            questionArray: [],
            currentQuestion: 0,
            startGame: false,
            nextButton: "Next question",
            endButton: "End Game"

        };
        this.setQuestionArray = this.setQuestionArray.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.playSong = this.playSong.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);


    }

    setQuestionArray = () => {
        let questionArray = [];
        var i;
        for (i = 0; i < this.state.questionData.length; i++){
            questionArray.push({
                "questionId": i,
                "songId": this.state.questionData[i].songId,
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


    startGame(){
        this.props.play(this.state.questionArray[0].songId);
        this.setState({
            startGame: true
        })
    }

    endGame() {
        this.setState({
            currentQuestion:  this.state.currentQuestion + 1
        })
    }


    playSong(songId) {
        this.props.play(songId);
    }

    componentWillMount() {
        this.setQuestionArray();
    }

    handleClick(choice){
        console.log(choice.target.value);
        if (choice.target.value === this.state.questionArray[this.state.currentQuestion].option1
            && this.state.currentQuestion === this.state.questionArray[this.state.currentQuestion].questionId){
            console.log("correct");
        } else {
            console.log("wrong")
        }
    };

    nextQuestion(){

        if (this.state.currentQuestion < this.state.questionArray.length){
            this.setState({
                currentQuestion:  this.state.currentQuestion + 1,
            });
            this.playSong(this.state.questionArray[this.state.currentQuestion + 1].songId);
        }

    }




    render() {

        //console.log(this.state);

        if (this.state.startGame === false) {
            return(
                <div className="game_body">
                    <button className="button" onClick={this.startGame}>Start Quiz</button>
                </div>
            )
        } else if (this.state.currentQuestion === this.state.questionArray.length && this.state.startGame === true)  {

            return(
                <div className="game_body">
                    Complete!
                </div>
            )
        } else if (this.state.currentQuestion === this.state.questionArray.length - 1 && this.state.startGame === true){

            return(
                <div className="game_body">
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option1}>{this.state.questionArray[this.state.currentQuestion].option1}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option2}>{this.state.questionArray[this.state.currentQuestion].option2}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option3}>{this.state.questionArray[this.state.currentQuestion].option3}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option4}>{this.state.questionArray[this.state.currentQuestion].option4}</button>
                    <button onClick={this.endGame}>{this.state.endButton}</button>
                </div>
            )
        }


        else if (this.state.currentQuestion !== this.state.questionArray.length && this.state.startGame === true) {

            return (
                <div className="game_body">
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option1}>{this.state.questionArray[this.state.currentQuestion].option1}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option2}>{this.state.questionArray[this.state.currentQuestion].option2}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option3}>{this.state.questionArray[this.state.currentQuestion].option3}</button>
                    <button onClick={this.handleClick}
                            value={this.state.questionArray[this.state.currentQuestion].option4}>{this.state.questionArray[this.state.currentQuestion].option4}</button>
                    <button onClick={this.nextQuestion}>{this.state.nextButton}</button>
                </div>
            );
        }
    }
}

export default Game;