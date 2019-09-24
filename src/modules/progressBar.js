import React, { Component } from 'react';
import '../index.css';
import styled from 'styled-components';


const Tracker = styled.div`
    width: 100%;
    height: 5px;
	background: rgba(255, 255, 255, 0.2);
`;

const ProgressInTracker = styled.div`
    width: 0%;
    -webkit-transition: width 0.5s;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    height: 100%;
	background: rgba(255, 255, 255, 0.6);
`;

class ProgressBar extends Component {

    render(){
        return(
            <Tracker>
                <ProgressInTracker style={{width: this.props.percentage + "%"}}/>
            </Tracker>
        )
    }
}

export default ProgressBar;