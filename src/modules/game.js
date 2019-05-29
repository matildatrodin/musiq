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

    /*Creates an array of questions from the question data created in quizGenerator*/

    setQuestionArray = () => {
        let questionArray = [];
        var i;
        for (i = 0; i < this.state.questionData.length; i++){
            questionArray.push({
                "questionId": i,
                "playlistImage": this.state.questionData[i].playlistImage,
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


    /*Moves the user to the end of the game*/

    endGame() {
        this.setState({
            currentQuestion:  this.state.questionArray.length
        })
    }

    /*Moves the user to the home page*/

    returnToMenu(){
        this.props.moveToHomePage();
    }

    /*Plays the current song in the game*/

    playSong(songId) {
        this.props.play(songId);
    }

    /*Before the component is rendered, the component will set the question array for the game*/

    componentWillMount() {
        this.setQuestionArray();
    }

    /*Once the component has been loaded, it will play the first song in the array of questions*/

    componentDidMount() {
        this.playSong(this.state.questionArray[0].songId);

    }

    /*Corrects the questions*/

    handleClick(choice){
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

    /*Moves the user to the next question*/

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

                    <div className="question">
                        <img src={this.state.questionArray[0].playlistImage}/>
                        <h1>Who's the artist of this song?</h1>
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
                        <p>{this.state.currentQuestion + 1} of {this.state.questionArray.length}</p>
                        <button onClick={this.endGame}>{this.state.endButton}</button>
                    </div>

                </div>
            )
        }


        else if (this.state.currentQuestion !== this.state.questionArray.length) {

            return (
                <div className="question_body">

                    <div className="question">
                        <img src={this.state.questionArray[0].playlistImage}/>
                        <h1>Who's the artist of this song?</h1>
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
                        <p>{this.state.currentQuestion + 1} of {this.state.questionArray.length}</p>
                        <button onClick={this.nextQuestion}>{this.state.nextButton}</button>
                    </div>

                </div>
            );
        }
    }
}

export default Game;