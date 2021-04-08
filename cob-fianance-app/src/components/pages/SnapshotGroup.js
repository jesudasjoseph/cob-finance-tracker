import React from 'react'
import ProfitProgress from '../Layout/ProfitProgress';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ExpenseProgress from '../Layout/ExpenseProgress';
import TransactionsTable from '../Layout/TransactionsTable';
import Expenses from '../Layout/ExpensesTable';
import BankProgress from '../Layout/BankProgress';
import NavibarI from '../Layout/MyNavBarI';
import Searchbar from '../Layout/SearchBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class SnapshotGroup extends React.Component{
	constructor(props){
      super(props);
      this.state = {path: 0};
      this.get_path = this.get_path.bind(this);
      this.getbusiness = this.getbusiness.bind(this);
			this.exportExpenseData = this.exportExpenseData.bind(this);
			this.exportTransactionData = this.exportTransactionData.bind(this);
			this.exportDepositData = this.exportDepositData.bind(this);
      this.get_path(this.state.path);
      this.getbusiness();
    }

	getbusiness(){
      fetch('http://' + '71.193.191.23' + ':2021/business/bybid?bid=' + this.state.path, {
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
        console.log('YUP:', data);
        this.setState({businessTable:data});
      }).catch((error) => {
        console.error('Error:', error);
      });
    }

	exportExpenseData(){
		fetch('http://' + '71.193.191.23' + ':2021/export/expense?bid=' + this.state.path, {
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
			downloadLink.download = "Bid_" + this.state.path + "_expenseData.csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			console.log('YUP:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	exportTransactionData(){
		fetch('http://' + '71.193.191.23' + ':2021/export/transaction?bid=' + this.state.path, {
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
			downloadLink.download = "Bid_" + this.state.path + "_transactionData.csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			console.log('YUP:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	exportDepositData(){
		fetch('http://' + '71.193.191.23' + ':2021/export/deposit?bid=' + this.state.path, {
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
			downloadLink.download = "Bid_" + this.state.path + "_depositData.csv";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			console.log('YUP:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	get_path(){
        var {pathname} = this.props.location;
        this.state.path = pathname.substring(1,pathname.length);

      }

	render () {
		const handleexpensetable = () => {
			<React.Fragment>
				<Expenses style = {{padding: '10px 20px'}}></Expenses>
			</React.Fragment>
		}

		return (
			<React.Fragment>
					<NavibarI/>
					<h1 style={{textAlign:'center'}}> Group Name </h1>
					<h2> Profit Goals</h2>
					<ProfitProgress />
					<h3 style={{padding: '20px 0px'}}>Expenses / Revenue</h3>
					<ExpenseProgress />
					<h3 style={{padding: '20px 0px'}}>Bank / Square Status</h3>
					<BankProgress/>
					<div style={{textAlign: 'left', margin: '20px 0px 5px 0px'}}>
						<Button style={{margin: '0px 5px'}} onClick={this.exportExpenseData}>Download Expense Data</Button>
						<Button style={{margin: '0px 5px'}} onClick={this.exportTransactionData}>Download Transaction Data</Button>
						<Button style={{margin: '0px 5px'}} onClick={this.exportDepositData}>Download Deposit Data</Button>
					</div>
					<Button style={{margin: '0px 5px'}} onClick={() => handleexpensetable()}> Get Expense Table </Button>
			</React.Fragment>
		)
	}

}
