import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import AddTransactionDialog from '../../layout/AddTransactionDialog';
import TableControl from '../../layout/TableControl';
import SearchBar from '../../layout/SearchBar';
import { API_PATH } from '../../Config';

import './styles/TransactionPage.css';

export default class TransactionPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			transactionTableData: [],
			showAddTransactionDialog: false,
			searchText: ''
		}
		this.fetchTransactionTableData = this.fetchTransactionTableData.bind(this);

		this.addOnClick = this.addOnClick.bind(this);

		this.addTransactionDialogOnClose = this.addTransactionDialogOnClose.bind(this);
		this.AddTransactionDialogOnSubmit = this.AddTransactionDialogOnSubmit.bind(this);

		this.searchOnChange = this.searchOnChange.bind(this);
	}

	componentDidMount(){
		this.fetchTransactionTableData();
	}

	fetchTransactionTableData(searchText = ''){
		fetch(API_PATH + '/transaction/byuid?start=0&end=50' + '&search=' + searchText, {
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
			this.setState({transactionTableData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	addOnClick(){
		this.setState({showAddTransactionDialog: true});
	}

	addTransactionDialogOnClose(){
		this.setState({showAddTransactionDialog: false});
	}
	AddTransactionDialogOnSubmit(transactionObject){
		const transactionBody = {transaction:transactionObject};

		fetch(API_PATH + '/transaction', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(transactionBody)
		}).then(response => {
			console.log(response);
			this.fetchTransactionTableData(this.state.searchText);
		}).catch((error) => {
			console.error('Error:', error);
		});

		this.setState({showAddTransactionDialog: false});
	}

	searchOnChange(text){
		this.setState({searchText: text});
		this.fetchTransactionTableData(text);
	}

	render() {
		return (
			<>
				<div className='transaction-container'>
					<div className='left'>
						<SearchBar onChange={this.searchOnChange}/>
						<div className='flex-container'>
							<h2>Transactions</h2>
							<Table responsive size="m" striped bordered hover variant="dark">
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
									{this.state.transactionTableData.map((transaction, index) => {
										const {customer, date, product, payment_method, quantity, price_per_unit, transaction_id, total} = transaction;
										return (
											<tr key={transaction_id}>
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
						</div>
					</div>
					<div className='right'>
						<TableControl add addOnClick={this.addOnClick}/>
					</div>
				</div>
				<AddTransactionDialog show={this.state.showAddTransactionDialog} handleClose={this.addTransactionDialogOnClose} handleSubmit={this.AddTransactionDialogOnSubmit}/>
			</>
		);
	}
}
