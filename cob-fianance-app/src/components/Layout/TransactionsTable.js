import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { API_PATH } from '../Config';

export class TransactionsTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			customer: '',
			date:'',
			product: '',
			payment_method: '',
			quantity: '',
			price_per_unit:'',
			total:'',
			transactionTable: []
		}
		this.get_transactions = this.get_transactions.bind(this);
		this.get_transactions();
	}
	get_transactions(){
		fetch(API_PATH + '/transaction/byuid?start=0&end=50', {
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
			this.setState({transactionTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render() {
		return (
			<>
				<Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
					<thead>
						<tr>
							<th>Date</th>
							<th>Customer</th>
							<th>Product</th>
							<th>Payment Method</th>
							<th>Quantity</th>
							<th>Price Per Unit</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{this.state.transactionTable.map((transaction, index) => {
							const {customer,date,product,payment_method, quantity, price_per_unit, tid, total} = transaction;
							return (
								<tr key={tid}>
									<td>{date.split('T')[0]} </td>
									<td>{customer}</td>
									<td>{product}</td>
									<td>{payment_method}</td>
									<td>{quantity}</td>
									<td>{price_per_unit}</td>
									<td>{total}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</>
		);
	}
}
export default TransactionsTable
