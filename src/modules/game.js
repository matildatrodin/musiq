import React, {Component} from 'react';
import '../index.css';


class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questionData: this.props.questionData,
            questionArray: [],
            currentQuestion: 0,
            nextButton: "Next question",
            endButton: "End Game",
            correctTitle: "Correct answers",
            wrongTitle: "Wrong answers",
            returnButton: "Return to menu",
            correct: 0,
            wrong: 0

        };
        this.setQuestionArray = this.setQuestionArray.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.playSong = this.playSong.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.endGame = this.endGame.bind(this);
        this.returnToMenu = this.returnToMenu.bind(this);


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


    endGame() {
        this.setState({
            currentQuestion:  this.state.questionArray.length
        })
    }

    returnToMenu(){
        this.props.moveToHomePage();
    }


    playSong(songId) {
        this.props.play(songId);
    }

    componentWillMount() {
        this.setQuestionArray();
    }

    componentDidMount() {
        this.playSong(this.state.questionArray[0].songId);

    }

    handleClick(choice){
        console.log(choice.target.value);
        if (choice.target.value === this.state.questionArray[this.state.currentQuestion].option1
            && this.state.currentQuestion === this.state.questionArray[this.state.currentQuestion].questionId){
            this.setState({
                correct: this.state.correct + 1
            });
            console.log("correct");
        } else {
            this.setState({
                wrong: this.state.wrong + 1
            });
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

        console.log(this.state);

        if (this.state.currentQuestion === this.state.questionArray.length)  {

            return(
                <div className="question_body">

                    <div className="result">
                        <h3>{this.state.correctTitle}: {this.state.correct}</h3>
                        <h3>{this.state.wrongTitle}: {this.state.wrong}</h3>
                    </div>

                    <div class="question_next">
                        <button onClick={this.returnToMenu}>{this.state.returnButton}</button>
                    </div>

                </div>
            )

        } else if (this.state.currentQuestion === this.state.questionArray.length - 1){

            return(
                <div className="question_body">

                    { /* <p>{this.state.currentQuestion + 1} / {this.state.questionArray.length}</p> */ }
                    <div className="question">
                        {/* playlist image */}
                        <h1>What's the name of this song?</h1>
                    </div>

                    <div className="answers">

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option1}>{this.state.questionArray[this.state.currentQuestion].option1}</button>
                        </div>

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option2}>{this.state.questionArray[this.state.currentQuestion].option2}</button>
                        </div>

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option3}>{this.state.questionArray[this.state.currentQuestion].option3}</button>
                        </div>

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option4}>{this.state.questionArray[this.state.currentQuestion].option4}</button>
                        </div>
                    </div>

                    <div class="question_next">
                        <button onClick={this.endGame}>{this.state.endButton}</button>
                    </div>

                </div>
            )
        }


        else if (this.state.currentQuestion !== this.state.questionArray.length) {

            return (
                <div className="question_body">

                    { /* <p>{this.state.currentQuestion + 1} / {this.state.questionArray.length}</p> */ }
                    <div className="question">
                        {/* playlist image */}
                        <h1>What's the name of this song?</h1>
                    </div>

                    <div className="answers">

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option1}>{this.state.questionArray[this.state.currentQuestion].option1}</button>
                        </div>

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option2}>{this.state.questionArray[this.state.currentQuestion].option2}</button>
                        </div>

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option3}>{this.state.questionArray[this.state.currentQuestion].option3}</button>
                        </div>

                        <div className="answer">
                            <button onClick={this.handleClick} value={this.state.questionArray[this.state.currentQuestion].option4}>{this.state.questionArray[this.state.currentQuestion].option4}</button>
                        </div>
                    </div>

                    <div class="question_next">
                        <button onClick={this.nextQuestion}>{this.state.nextButton}</button>
                    </div>

                </div>
            );
        }
    }
}

export default Game;