import React, {Component} from 'react'
import ExpenseProgress from '../../layout/ExpenseProgress';
import BankProgress from '../../layout/BankProgress';
import ProfitDial from '../../layout/ProfitDial';

import './styles/Dashboard.css';

export class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			hasCompany: true,
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
			if (response.status === 404){
				this.setState({hasCompany: false});
			}
			else {
				return response.json();
			}		
		}).then(data => {
			this.setState({business:data[0]});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render(){
		if (this.state.hasCompany){
			return (
				<>
					<div style={{textAlign:'center', padding: '4px'}}><h1><b>{this.state.business.company_id}</b></h1></div>
					<div className='dashboard-container'>
						<div className='left'>
							<ProfitDial className='.student-profit' profit={this.state.business.profit} goal={this.state.business.profit_goal} stretchGoal={this.state.business.stretch_profit_goal}/>
						</div>
						<div className='right'>
							<h3>Expenses / Revenue</h3>
							<ExpenseProgress revenue={this.state.business.transaction_total} expenses={this.state.business.expense_total}/>
							<h3>Bank / Square Status</h3>
							<BankProgress revenue={this.state.business.transaction_total} square={this.state.business.square_total} bank={this.state.business.deposit_total}/>
						</div>
					</div>
				</>
			);
		}
		else {
			return (
				<>
					<h3>You are currently not part of a company! Please contact your instructor!</h3>
				</>
			);
		}
		
	}
}
export default Dashboard;
