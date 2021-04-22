import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { API_PATH } from '../Config';

export class ExpenseProgress extends Component {
	constructor(props){
		super(props);
	}
	render() {
		return(
			<>
				<ProgressBar  style= {{height:'50px'}} variant="danger" now={100*this.props.expenses/(this.props.expenses > this.props.revenue ? this.props.expenses : this.props.revenue)} label={`Expenses: $${this.props.expenses}`} />
				<ProgressBar style= {{height:'50px'}} variant="success" now={100*this.props.revenue/(this.props.expenses > this.props.revenue ? this.props.expenses : this.props.revenue)} label={`Revenue: $${this.props.revenue}`}/>
			</>
		)
	}
}

export default ExpenseProgress
