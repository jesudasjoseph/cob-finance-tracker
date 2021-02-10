import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

const now = 23;

const progressInstance = <ProgressBar now={now} label={`${now}%`} />;

export class ProfitProgress extends Component {
    render() {
        if(now<25){
        return (
            <ProgressBar style= {{height:'50px'}} now={now} variant="danger" label={`${now}%`} />
        )
        }
        if(now>25 && now<100){
            return (
                <ProgressBar style= {{height:'50px'}} now={now} variant="warning" label={`${now}%`} />
                )
            }
        if(now>=100){
            return (
            <ProgressBar style= {{height:'50px'}} now={now} variant="success" label={`GOAL REACHED: ${now}%`} />
            )
        }

    }
}


export default ProfitProgress
