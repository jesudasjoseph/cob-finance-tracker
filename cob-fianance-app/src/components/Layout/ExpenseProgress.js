import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { API_PATH } from '../Config';

export class ExpenseProgress extends Component {
	constructor(props){
		super(props);
	}
	render() {
		let expenses = parseFloat(this.props.expenses);
		let revenue = parseFloat(this.props.revenue);

		let expense_percent = 0.0;
		let revenue_percent = 0.0;

		if (expenses > revenue){
			expense_percent = 100;
			revenue_percent = 100 * revenue / expenses;
		}
		else {
			revenue_percent = 100;
			expense_percent = 100 * expenses / revenue;
		}

		return(
			<>
				<ProgressBar  style= {{height:'50px'}} variant="danger" now={expense_percent} label={`Expenses: $${expenses}`} />
				<ProgressBar style= {{height:'50px'}} variant="success" now={revenue_percent} label={`Revenue: $${revenue}`}/>
			</>
		)
	}
}
export default ExpenseProgress
