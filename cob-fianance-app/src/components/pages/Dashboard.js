import React, {Component} from 'react'
import ProfitProgress from '../Layout/ProfitProgress';
import ExpenseProgress from '../Layout/ExpenseProgress';
import BankProgress from '../Layout/BankProgress';
import AddTransactionDialogButton from '../Layout/AddTransactionDialogButton';
import AddExpenseDialogButton from '../Layout/AddExpenseDialogButton';
import { API_PATH } from '../Config';

export class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			business: []
		};
		this.fetchBusinessData = this.fetchBusinessData.bind(this);
	}

	componentDidMount(){
		this.fetchBusinessData();
	}

	fetchBusinessData(){
		fetch(API_PATH + '/business/byuid', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			this.setState({business:data[0]});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render(){
		return (
			<React.Fragment>
				<div className="container">
					<h1 style={{textAlign:'center'}}>Dashboard</h1>
					<h3 style={{padding: '20px 0px 0px 0px'}}>Profit Goals</h3>
					<ProfitProgress profit={this.state.business.profit} profitGoal={this.state.business.profit_goal} profitStretchGoal={this.state.business.stretch_profit_goal}/>
					<h3 style={{padding: '20px 0px 0px 0px'}}>Expenses / Revenue</h3>
					<ExpenseProgress revenue={this.state.business.transaction_total} expenses={this.state.business.expense_total}/>
					<h3 style={{padding: '20px 0px 0px 0px'}}>Bank / Square Status</h3>
					<BankProgress/>
					<AddTransactionDialogButton style={{marginTop: '10px', marginLeft: '10px', marginRight: '10px'}}/>
					<AddExpenseDialogButton style={{marginTop: '10px', marginLeft: '10px', marginRight: '10px'}}/>
				</div>
			</React.Fragment>
		);
	}
}
export default Dashboard;
