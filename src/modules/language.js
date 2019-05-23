import React, { Component } from 'react';
import '../index.css';
import uk_flag from'../resources/icons/uk.svg'
import se_flag from'../resources/icons/se.svg'

class Language extends Component {

    constructor(props){
        super(props);

        this.state = {
            
        };
    }

    languageSwitch = () => {
        alert("LANGUAGE SWITCHING");
    }

    render() {

        return (
            <div className="language">
                <img className="flag" id="en" src={uk_flag} onClick={this.languageSwitch} alt="EN"/>
                <img className="flag" id="sv" src={se_flag} onClick={this.languageSwitch} alt="SE"/>
            </div>

        );
    }
}

export default Language;
