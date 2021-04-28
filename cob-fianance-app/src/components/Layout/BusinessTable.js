import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfitProgress from '../Layout/ProfitProgress';
import Button from 'react-bootstrap/Button';
import { API_PATH } from '../Config';


export class BusinessTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			businessTable: [],
			revenueTotal: 0,
			quantityTotal: 0,
			expenseTotal: 0,
			profitTotal: 0
		}

		this.fetchBusinessData = this.fetchBusinessData.bind(this);
		this.getBusinessTotals = this.getBusinessTotals.bind(this);
		this.sortByInstructorClickHandler = this.sortByInstructorClickHandler.bind(this);
		this.sortBySectionClickHandler = this.sortBySectionClickHandler.bind(this);
		this.sortByNameClickHandler = this.sortByNameClickHandler.bind(this);
		this.onDeleteClick = this.onDeleteClick.bind(this);
}

	componentDidMount(){
		this.fetchBusinessData('name');
	}

	fetchBusinessData(sortParam){

		let URL = API_PATH + '/business?start=0&end=50'
		if (sortParam){
			URL = URL + '&sort=' + sortParam;
		}

		fetch(URL, {
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
			this.setState({
					businessTable:data
				});
			console.log('Current Business Table: ', this.state.businessTable);
			this.getBusinessTotals();
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	getBusinessTotals(){
		this.setState({
			revenueTotal:0,
			quantityTotal:0,
			expenseTotal:0,
			profitTotal:0
		});
		for (let i = 0; i < this.state.businessTable.length; i++){
			this.setState({
				revenueTotal:this.state.revenueTotal+parseFloat(this.state.businessTable[i].deposit_total),
				quantityTotal:this.state.quantityTotal+parseFloat(this.state.businessTable[i].product_count),
				expenseTotal:this.state.expenseTotal+parseFloat(this.state.businessTable[i].expense_total),
				profitTotal:this.state.profitTotal+parseFloat(this.state.businessTable[i].profit)
			});
		}
	}

	sortByInstructorClickHandler() {
		this.fetchBusinessData("instructor");
	}

	sortBySectionClickHandler() {
		this.fetchBusinessData("section");
	}

	sortByNameClickHandler() {
		this.fetchBusinessData("name");
	}

	onDeleteClick(bid,index){
		fetch(API_PATH + '/business/bybid?bid=' + bid, {
			mode: 'cors',
			method: 'DELETE',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			console.log(response);
			let curTable = this.state.businessTable;
			curTable.splice(index, 1);
			this.setState({businessTable:curTable});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render() {
		return (
			<div>
				<Nav>
					<NavDropdown title="Filter By">
						<NavDropdown.Item onClick={this.sortByInstructorClickHandler}>Instructor</NavDropdown.Item>
						<NavDropdown.Item onClick={this.sortBySectionClickHandler}>Section</NavDropdown.Item>
						<NavDropdown.Item onClick={this.sortByNameClickHandler}>Name</NavDropdown.Item>
					</NavDropdown>
				</Nav>
				<Table responsive="sm" size="sm" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
					<thead>
 						<tr>
							<th style={{verticalAlign: 'text-top'}}>
								Company
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.businessTable.length}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Section
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Instructor
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Items Sold
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.quantityTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Bank
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Square
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Revenue
								<p style={{fontSize:'14px', color:'grey'}}>Total: ${this.state.revenueTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Expenses
								<p style={{fontSize:'14px', color:'grey'}}>Total: ${this.state.expenseTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Profits
								<p style={{fontSize:'14px', color:'grey'}}>Total: ${this.state.profitTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Sales Goals
							</th>
							<th/>
						</tr>
					</thead>
					<tbody>
						{
							this.state.businessTable.map((business, index) => {
							const {name, instructor, section, transaction_total, deposit_total, product_count, expense_total, bid, profit, profit_goal, stretch_profit_goal, square} = business;
							return (
								<tr key={bid}>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer', minWidth: '150px'}}>{name}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>{section}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>{instructor}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>{product_count}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>${deposit_total}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>${square}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>${transaction_total}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>${expense_total}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>${profit}</td>
									<td onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}><ProfitProgress profit={profit} profitGoal={profit_goal} profitStretchGoal={stretch_profit_goal}/></td>
									<td><Button onClick={() => this.onDeleteClick(bid,index)}>Delete</Button></td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default BusinessTable
