import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import TableControl from '../../layout/TableControl';
import AddExpenseDialog from '../../layout/AddExpenseDialog';
import SearchBar from '../../layout/SearchBar';
import { API_PATH } from '../../Config';
import './styles/ExpensePage.css';

export default class ExpensePage extends Component {
	constructor(props){
		super(props);
		this.state = {
			expenseTableData: [],
			showAddDialog: false,
			searchText: ''
		}
		this.fetchExpenseTableData = this.fetchExpenseTableData.bind(this);

		this.addOnClick = this.addOnClick.bind(this);

		this.addExpenseDialogOnClose = this.addExpenseDialogOnClose.bind(this);
		this.addExpenseDialogOnSubmit = this.addExpenseDialogOnSubmit.bind(this);

		this.searchOnChange = this.searchOnChange.bind(this);
	}

	componentDidMount(){
		this.fetchExpenseTableData(this.state.searchText);
	}

	addOnClick(){
		this.setState({showAddDialog: true});
	}

	addExpenseDialogOnClose(){
		this.setState({showAddDialog: false});
	}
	addExpenseDialogOnSubmit(transactionObject){
		this.setState({showAddDialog: false});
		const expense_body = { expense:transactionObject };

		fetch(API_PATH + '/expense', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(expense_body)
		}).then(response => {
			console.log(response);
			this.fetchExpenseTableData(this.state.searchText);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	fetchExpenseTableData(searchParam = ''){
		fetch(API_PATH + '/expense/byuid?start=0&end=50' + '&search=' + searchParam, {
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
			this.setState({expenseTableData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	searchOnChange(text){
		this.setState({searchText: text});
		this.fetchExpenseTableData(text);
	}

	render() {
		return (
			<>
				<div className='expense-container'>
					<div className='left'>
						<SearchBar onChange={this.searchOnChange}/>
						<div className='flex-container'>
							<h2>Business Expenses</h2>
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
					</div>
					<div className='right'>
						<TableControl add addOnClick={this.addOnClick}/>
					</div>
				</div>
				<AddExpenseDialog show={this.state.showAddDialog} handleClose={this.addExpenseDialogOnClose} handleSubmit={this.addExpenseDialogOnSubmit}/>
			</>
		);
	}
}
