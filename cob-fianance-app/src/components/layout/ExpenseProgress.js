import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

export class ExpenseProgress extends Component {
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
				<ProgressBar style={{fontSize: '1em', height: '3em'}} variant="danger" now={expense_percent} label={`Expenses: $${expenses}`} />
				<ProgressBar style={{fontSize: '1em', height: '3em'}} variant="success" now={revenue_percent} label={`Revenue: $${revenue}`}/>
			</>
		)
	}
}
export default ExpenseProgress
