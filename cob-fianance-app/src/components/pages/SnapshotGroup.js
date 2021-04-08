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
//let fetch = require("fetch");
//
//<React.Fragment>
//  <Expenses style = {{padding: '10px 20px'}}></Expenses>
//</React.Fragment>


export default class SnapshotGroup extends React.Component{
	constructor(props){
      super(props);
      this.state = {
          path: 0}
      this.get_path = this.get_path.bind(this);
      this.getbusiness = this.getbusiness.bind(this);
			this.exportBusinessData = this.exportBusinessData.bind(this);
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

	exportBusinessData(){
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
			return response;
		}).then(data => {
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
					<div style={{textAlign: 'right'}}>
						<Button onClick={this.exportBusinessData}>Download Business Data</Button>
					</div>
					<h2> Profit Goals</h2>
					<ProfitProgress />
					<h3 style={{padding: '20px 0px'}}>Expenses / Revenue</h3>
					<ExpenseProgress />
					<h3 style={{padding: '20px 0px'}}>Bank / Square Status</h3>
					<BankProgress/>
					<Button onClick={() => handleexpensetable()}> Get Expense Table </Button>
			</React.Fragment>
		)
	}

}
