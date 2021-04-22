import React, {Component} from 'react'
import ProfitProgress from '../Layout/ProfitProgress';
import ExpenseProgress from '../Layout/ExpenseProgress';
import BankProgress from '../Layout/BankProgress';
//let fetch = require("fetch");
import Navbar from '../Layout/MyNavbar';

export class Dashboard extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
			<React.Fragment>
				<Navbar></Navbar>
				<h1 style={{paddingBottom:'20px', textAlign:'center'}}>Dashboard</h1>
				<h3>Profit Goals</h3>
				<ProfitProgress />
				<h3 style={{padding: '20px 0px'}}>Expenses / Revenue</h3>
				<ExpenseProgress />
				<h3 style={{padding: '20px 0px'}}>Bank / Square Status</h3>
				<BankProgress/>
			</React.Fragment>
		);
	}
}
export default Dashboard;
