import React, {Component} from 'react'
import ProfitProgress from '../../layout/ProfitProgress';
import ExpenseProgress from '../../layout/ExpenseProgress';
import BankProgress from '../../layout/BankProgress';
import CircleProfitProgress from '../../layout/CircleProfitProgress';

import './styles/Dashboard.css';

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
		fetch(process.env.REACT_APP_API_PATH + '/business/byuid', {
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
			<>
				<div style={{textAlign:'center', padding: '4px'}}><h1><b>{this.state.business.company_id}</b> - dashboard</h1></div>
				<div className='dashboard-container'>
					<div className='flex-container left'>
						<CircleProfitProgress profit={this.state.business.profit} goal={this.state.business.profit_goal} stretchGoal={this.state.business.stretch_profit_goal}/>
					</div>
					<div className='flex-container right'>
						<h3 style={{padding: '20px 0px 0px 0px'}}>Expenses / Revenue</h3>
						<ExpenseProgress revenue={this.state.business.transaction_total} expenses={this.state.business.expense_total}/>
						<h3 style={{padding: '20px 0px 0px 0px'}}>Bank / Square Status</h3>
						<BankProgress revenue={this.state.business.transaction_total} square={this.state.business.square_total} bank={this.state.business.deposit_total}/>
					</div>
				</div>
			</>
		);
	}
}
export default Dashboard;
