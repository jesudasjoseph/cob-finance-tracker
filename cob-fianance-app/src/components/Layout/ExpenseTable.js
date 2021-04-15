import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { API_PATH } from '../Config';

export class ExpenseTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			expensesTable: []
		}
		this.get_expenses = this.get_expenses.bind(this);
		this.get_expenses();
	}

	get_expenses(){
		fetch(API_PATH + '/expense/byuid?start=0&end=50', {
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
			this.setState({expensesTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render() {
		return (
			<div>
				<Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
					<thead>
						<tr>
							<th>Quantity</th>
							<th>Product</th>
							<th>Company</th>
							<th>Date</th>
							<th>Payment Method</th>
							<th>Price Per Unit</th>
							<th>Justification</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{this.state.expensesTable.map((expense, index) => {
							const {quantity,product,company, date, payment_method, price_per_unit, justification, total,eid} = expense;
							return (
								<tr key={eid}>
									<td> {quantity}</td>
									<td> {product} </td>
									<td>{company}</td>
									<td> {date.split('T')[0]} </td>
									<td> {payment_method} </td>
									<td> {price_per_unit} </td>
									<td> {justification} </td>
									<td> {total} </td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}
export default ExpenseTable
