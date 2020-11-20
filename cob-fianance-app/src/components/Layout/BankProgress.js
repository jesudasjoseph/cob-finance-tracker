import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

export class BankProgress extends Component {
    render() {
        return (
        <div>
            <ProgressBar variant="dark" now={40} label={'Total Revenue'} />
            <ProgressBar>
                <ProgressBar variant="blue" now={15} key={1} label={'Sqaure'} />
                <ProgressBar variant="success" now={60} key={2} label={'Bank'}/>
                </ProgressBar>
        </div>
        )
    }
}

export default BankProgress
