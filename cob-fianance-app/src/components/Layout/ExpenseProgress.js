import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

export class ExpenseProgress extends Component {
    render() {
        return(
        <div>
            <ProgressBar  style= {{height:'50px'}} variant="danger" now={40} label={'Expenses'} />
            <ProgressBar style= {{height:'50px'}} variant="success" now={20} label={'Revenue'}/>
        </div>
        )
    }
}

export default ExpenseProgress
