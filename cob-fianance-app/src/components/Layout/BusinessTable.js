import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfitProgress from '../Layout/ProfitProgress';
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

		this.get_businesses = this.get_businesses.bind(this);
		this.get_business_totals = this.get_business_totals.bind(this);
		this.sortByInstructorClickHandler = this.sortByInstructorClickHandler.bind(this);
		this.sortBySectionClickHandler = this.sortBySectionClickHandler.bind(this);
		this.sortByNameClickHandler = this.sortByNameClickHandler.bind(this);
}

	componentDidMount(){
		this.get_businesses('name');
	}

	get_businesses(sortParam){

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
			this.get_business_totals();
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	get_business_totals(){
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
		this.get_businesses("instructor");
	}

	sortBySectionClickHandler() {
		this.get_businesses("section");
	}

	sortByNameClickHandler() {
		this.get_businesses("name");
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
								Group
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.businessTable.length}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Section
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Instructor
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Revenue
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.revenueTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Items Sold
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.quantityTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Expenses
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.expenseTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Profits
								<p style={{fontSize:'14px', color:'grey'}}>Total: {this.state.profitTotal}</p>
							</th>
							<th style={{verticalAlign: 'text-top'}}>
								Sales Goals
							</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.businessTable.map((business, index) => {
							const {name,instructor,section,deposit_total,product_count,expense_total, bid, profit} = business;
							return (
								<tr key={bid} onClick={() => window.location+=("/"+bid)} style={{cursor: 'pointer'}}>
									<td style={{minWidth: '150px'}}>{name}</td>
									<td>{section}</td>
									<td>{instructor}</td>
									<td>{deposit_total}</td>
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

export default BusinessTable
