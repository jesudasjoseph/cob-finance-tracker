import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import AddTransactionDialog from '../../layout/AddTransactionDialog';
import TableControl from '../../layout/TableControl';
import SearchBar from '../../layout/SearchBar';

import { AppContext } from '../../../AppContext';

export default class TransactionPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			hasCompany: true,
			transactionTableData: [],
			showAddTransactionDialog: false,
			searchText: ''
		}

		this.fetchTransactionTableData = this.fetchTransactionTableData.bind(this);
		this.addOnClick = this.addOnClick.bind(this);
		this.addTransactionDialogOnClose = this.addTransactionDialogOnClose.bind(this);
		this.searchOnChange = this.searchOnChange.bind(this);
	}

	componentDidMount(){
		this.fetchTransactionTableData();
	}

	fetchTransactionTableData(searchText = ''){
		if (searchText === '')
			searchText = this.state.searchText;
		fetch(process.env.REACT_APP_API_PATH + '/transaction/byuid?start=0&end=50&search=' + searchText, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			if (response.status === 404){
				this.setState({hasCompany: false});
			}
			else {
				return response.json();
			}
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

	searchOnChange(text){
		this.setState({searchText: text});
		this.fetchTransactionTableData(text);
	}

	render() {
		if (this.state.hasCompany) {
			return (
				<>
					<div className='layout-tb-container'>
						<SearchBar className='layout-tb-search' onChange={this.searchOnChange}/>
						<p></p>
						<Table className='layout-tb-table' responsive size="m" striped bordered hover variant="dark">
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
						<div className='layout-tb-controls'>
							<TableControl add addOnClick={this.addOnClick}/>
						</div>
					</div>
					<AddTransactionDialog show={this.state.showAddTransactionDialog} onClose={this.addTransactionDialogOnClose} onSuccess={this.fetchTransactionTableData}/>
				</>
			);
		}
		else {
			return (
				<>
					<h3>You are currently not part of a company! Please contact your instructor!</h3>
				</>
			);
		}
	}
}
TransactionPage.contextType = AppContext;
