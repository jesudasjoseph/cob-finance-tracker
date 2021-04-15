import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfitProgress from '../Layout/ProfitProgress';
import { API_PATH } from '../Config';


export class Tables extends Component {
	constructor(props){
		super(props);
		this.state = {
			businessTable: [],
			businessCount: 0,
			revenueTotal: 0,
			quantityTotal: 0,
			expenseTotal: 0,
			transactionTotal: 0,
			profitTotal: 0
		}

		this.get_businesses = this.get_businesses.bind(this);
		this.get_business_totals = this.get_business_totals.bind(this);
		this.sortByInstructorClickHandler = this.sortByInstructorClickHandler.bind(this);
		this.sortBySectionClickHandler = this.sortBySectionClickHandler.bind(this);
}

	componentDidMount(){
		this.get_businesses();
		this.get_business_totals();
	}

	get_businesses(sortParam){

		let URL = API_PATH + '/business?start=0&end=50'
		switch(sortParam){
			case "instructor":
				URL = URL + '&sort=instructor';
				break;
			case "section":
				URL = URL + '&sort=section';
				break;
			default:
				break;
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
			this.setState({businessTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	get_business_totals(){
		fetch(API_PATH + '/businesstotals?start=0&end=50', {
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
			this.setState({businessCount:data.total,
				revenueTotal:data.revenue,
				quantityTotal:data.quantity,
				expenseTotal:data.expense,
				transactionTotal:date.transaction,
				profitTotal:data.profit
				});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	sortByInstructorClickHandler() {
		this.get_businesses("instructor");
	}

	sortBySectionClickHandler() {
		this.get_businesses("section");
	}

	render() {
		return (
			<div>
				<Nav>
					<NavDropdown title="Filter By" id="collasible-nav-dropdown">
						<NavDropdown.Item onClick={this.sortByInstructorClickHandler}>Instructor</NavDropdown.Item>
						<NavDropdown.Item onClick={this.sortBySectionClickHandler}>Section</NavDropdown.Item>
					</NavDropdown>
				</Nav>
				<Table responsive="sm" size="sm" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
					<thead>
 						<tr>
							<th>
								Group
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.businessCount}</p>
							</th>
							<th>
								Section
							</th>
							<th>
								Instructor
							</th>
							<th>
								Revenue
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.revenueTotal}</p>
							</th>
							<th>
								Bank
							</th>
							<th>
								Square
							</th>
							<th>
								Items Sold
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.quantityTotal}</p>
							</th>
							<th>
								Expenses
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.expenseTotal}</p>
							</th>
							<th>
								Profits
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.profitTotal}</p>
							</th>
							<th>Sales Goals</th>
						</tr>
					</thead>
					<tbody>
						{this.state.businessTable.map((business, index) => {
							const {name,instructor,section,deposit_total,product_count,expense_total, bid, profit} = business;
							return (
								<tr key={bid} onClick={() => window.location=bid} style={{cursor: 'pointer'}}>
									<td style={{minWidth: '150px'}}>{name}</td>
									<td>{section}</td>
									<td>{instructor}</td>
									<td>{deposit_total}</td>
									<td>Bank Money</td>
									<td>Square Money</td>
									<td>{product_count}</td>
									<td>{expense_total}</td>
									<td>{profit}</td>
									<td><ProfitProgress dataFromParent = {bid}/></td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default Tables
