import React from 'react'
import ProfitProgress from '../../layout/ProfitProgress';
import ExpenseProgress from '../../layout/ExpenseProgress';
import TransactionTable from '../../layout/TransactionsTable';
import BankProgress from '../../layout/BankProgress';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { API_PATH } from '../../Config';
import StudentTable from '../../layout/BusinessStudents';

export default class SnapshotGroup extends React.Component{
	constructor(props){
		super(props);

		let bid = parseInt(this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1]);

		this.state = {
			expenseTableData: [],
			bid: bid,
			business: [],
			students: []
		};

		this.fetchExpenseTableData = this.fetchExpenseTableData.bind(this);
		this.fetchBusinessData = this.fetchBusinessData.bind(this);

		this.exportExpenseData = this.exportExpenseData.bind(this);
		this.exportTransactionData = this.exportTransactionData.bind(this);
		this.exportDepositData = this.exportDepositData.bind(this);
	}

	componentDidMount(){
		if (isNaN(this.state.bid))
			this.props.history.push('/404');
		else {
			this.fetchBusinessData();
			this.fetchExpenseTableData();
		}
	}

	fetchExpenseTableData(){
		fetch(API_PATH + '/expense?start=0&end=50&bid=' + this.state.bid, {
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
			if (data != null)
				this.setState({expenseTableData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	fetchBusinessData(){
		fetch(API_PATH + '/business/bybid?bid=' + this.state.bid, {
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

	exportExpenseData(){
		fetch(API_PATH + '/export/expense?bid=' + this.state.bid, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'text/csv',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			console.log(response);
			return response.text();
		}).then(data => {
			//Create a CSV Download link
			var downloadLink = document.createElement("a");
			var blob = new Blob(["\ufeff", data]);
			var url = URL.createObjectURL(blob);
			downloadLink.href = url;
			downloadLink.download = "Bid_" + this.state.bid + "_expenseData.csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			console.log('YUP:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	exportTransactionData(){
		fetch(API_PATH + '/export/transaction?bid=' + this.state.bid, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'text/csv',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			console.log(response);
			return response.text();
		}).then(data => {
			//Create a CSV Download link
			var downloadLink = document.createElement("a");
			var blob = new Blob(["\ufeff", data]);
			var url = URL.createObjectURL(blob);
			downloadLink.href = url;
			downloadLink.download = "Bid_" + this.state.bid + "_transactionData.csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			console.log('YUP:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	exportDepositData(){
		fetch(API_PATH + '/export/deposit?bid=' + this.state.bid, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'text/csv',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			console.log(response);
			return response.text();
		}).then(data => {
			//Create a CSV Download link
			var downloadLink = document.createElement("a");
			var blob = new Blob(["\ufeff", data]);
			var url = URL.createObjectURL(blob);
			downloadLink.href = url;
			downloadLink.download = "Bid_" + this.state.bid + "_depositData.csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			console.log('YUP:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render () {
		return (
			<React.Fragment>
				<h1 style={{textAlign:'center'}}>{this.state.business.name}</h1>
				<StudentTable dataFromParent = {{bid: this.state.bid}} Mystudents = {{students: this.state.students}}/>
				<h3> Profit Goals</h3>
				<ProfitProgress profit={this.state.business.profit} profitGoal={this.state.business.profit_goal} profitStretchGoal={this.state.business.stretch_profit_goal}/>
				<h3 style={{padding: '20px 0px'}}>Expenses / Revenue</h3>
				<ExpenseProgress revenue={this.state.business.transaction_total} expenses={this.state.business.expense_total}/>
				<h3 style={{padding: '20px 0px'}}>Bank / Square Status</h3>
				<BankProgress revenue={this.state.business.transaction_total} square={this.state.business.square_total} bank={this.state.business.deposit_total}/>
				<div style={{textAlign: 'left', margin: '20px 0px 5px 0px'}}>
					<Button style={{margin: '0px 5px'}} onClick={this.exportExpenseData}>Download Expense Data</Button>
					<Button style={{margin: '0px 5px'}} onClick={this.exportTransactionData}>Download Transaction Data</Button>
					<Button style={{margin: '0px 5px'}} onClick={this.exportDepositData}>Download Deposit Data</Button>
				</div>
				<h3 style={{padding: '20px 0px'}}>Expenses</h3>
				<div className='flex-container'>
					<Table
						responsive
						size="m"
						striped bordered hover variant="dark">
						<thead>
							<tr>
								<th>Date</th>
								<th>Product</th>
								<th>Company</th>
								<th>Payment Method</th>
								<th>Quantity</th>
								<th>Price Per Unit</th>
								<th>Total</th>
								<th>Justification</th>
							</tr>
						</thead>
						<tbody>
							{this.state.expenseTableData.map((expense, index) => {
								const {quantity,product,company, date, payment_method, price_per_unit, justification, total,eid} = expense;
								return (
									<tr key={eid}>
										<td> {date.split('T')[0]} </td>
										<td> {product}</td>
										<td>{company}</td>
										<td>{payment_method}</td>
										<td>{quantity}</td>
										<td>{price_per_unit}</td>
										<td>{total}</td>
										<td>{justification}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</div>
				<h3 style={{padding: '20px 0px'}}>Transactions</h3>
				<TransactionTable style = {{padding: '10px 20px'}} dataFromParent = {{bid: this.state.bid}}/>

			</React.Fragment>
		)
	}

}
