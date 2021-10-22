import React, { Component } from 'react'
import MobileTable from '../../layout/MobileTable';
import TableControl from '../../layout/TableControl';
import AddExpenseDialog from '../../layout/AddExpenseDialog';
import SearchBar from '../../layout/SearchBar';

import { AppContext } from '../../../AppContext';

export default class ExpensePage extends Component {
	constructor(props){
		super(props);
		this.state = {
			hasCompany: true,
			expenseTableData: [],
			showAddDialog: false,
			searchText: ''
		}
		this.fetchExpenseTableData = this.fetchExpenseTableData.bind(this);
		this.addOnClick = this.addOnClick.bind(this);
		this.addExpenseDialogOnClose = this.addExpenseDialogOnClose.bind(this);
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

	fetchExpenseTableData(searchText = ''){
		if (searchText === '')
			searchText = this.state.searchText;
		fetch(process.env.REACT_APP_API_PATH + '/expense/byuid?start=0&end=50&search=' + searchText, {
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
		if (this.state.hasCompany) {
			return (
				<>
					<div className='layout-tb-container'>
						<SearchBar className='layout-tb-search' onChange={this.searchOnChange}/>
						<p></p>
						<MobileTable>
							{this.state.expenseTableData.map((expense, index) => {
								const {quantity,product,company, date, payment_method, price_per_unit, total, expense_id} = expense;
								return (
									<MobileTable.ExpenseItem key={expense_id} 
										date={date.split('T')[0]} 
										subtitle={company}
										title={product}
										payment={payment_method}
										quantity={quantity}
										unit_price={price_per_unit}
										total={total}/>
								);
							})}
						</MobileTable>
						<div className='layout-tb-controls'>
							<TableControl add addOnClick={this.addOnClick}/>
						</div>
					</div>
					<AddExpenseDialog show={this.state.showAddDialog} onClose={this.addExpenseDialogOnClose} onSuccess={this.fetchExpenseTableData}/>
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
ExpensePage.contextType = AppContext;
