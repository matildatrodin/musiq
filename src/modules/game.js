import React, {Component} from 'react';
import '../index.css';


class Game extends Component {

    constructor(props){
        super(props);

        this.state = {
            questionData: this.props.questionData,
            questionArray: [],
            optionArray: [],
            currentQuestion: 0,
            answered: false,
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
        let i;
        for (i = 0; i < this.state.questionData.length; i++){
            questionArray.push({
                "questionId": i,
                "playlistImage": this.state.questionData[i].playlistImage,
                "songId": this.state.questionData[i].songId,
                "artist": this.state.questionData[i].artist,
                "options": this.shuffleOptions(this.state.questionData[i].options),

            })
        }
        this.setState({
            questionArray: questionArray,
        })
    };

    /* Shuffles the options*/

    shuffleOptions(options){
        for ( let i = options.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }


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
        if (this.state.answered === true){
            console.log("You already answered")
        } else if (choice.target.value === this.state.questionArray[this.state.currentQuestion].artist
            && this.state.currentQuestion === this.state.questionArray[this.state.currentQuestion].questionId){
            this.setState({
                correct: this.state.correct + 1,
                answered: true
            });
            console.log("correct");
        } else {
            this.setState({
                wrong: this.state.wrong + 1,
                answered: true
            });
            console.log("wrong")
        }
    };

    /*Moves the user to the next question*/

    nextQuestion(){

        if (this.state.currentQuestion < this.state.questionArray.length){
            this.setState({
                currentQuestion:  this.state.currentQuestion + 1,
                answered: false
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

                    <div className="question_next">
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
                    {this.state.questionArray[this.state.currentQuestion].options.map(option =>
                        <button onClick={this.handleClick} className="answerButton" value={option.name}>{option.name}</button>)}
                    </div>



                    <div className="question_next">
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
                    {this.state.questionArray[this.state.currentQuestion].options.map(option =>
                            <button onClick={this.handleClick} className="answerButton" value={option.name}>{option.name}</button>)}
                    </div>

                    <div className="question_next">
                        <p>{this.state.currentQuestion + 1} of {this.state.questionArray.length}</p>
                        <button onClick={this.nextQuestion}>{this.state.nextButton}</button>
                        <button onClick={this.endGame}>{this.state.endButton}</button>
                    </div>

                </div>
            );
        }
    }
}

export default Game;