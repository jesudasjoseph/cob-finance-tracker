import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ProgressBarSmallProfit from '../../layout/ProgressBarSmallProfit';
import SearchBar from '../../layout/SearchBar.js';
import TableControl from '../../layout/TableControl.js';
import AddCompanyDialog from '../../layout/AddCompanyDialog';
import SortSelector from '../../layout/SortSelector.js';

import { AppContext } from '../../../AppContext';

import './styles/CompanyManagementPage.css';

export default class CompanyManagementPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			companyTable: [],
			tableMaxRows: 18,
			tableInitialIndex: 0,
			selectedRow: -1,
			revenueTotal: 0,
			quantityTotal: 0,
			expenseTotal: 0,
			profitTotal: 0,
			bankTotal: 0,
			squareTotal: 0,
			addDisabled: false,
			deleteDisabled: true,
			sortOption: 'name',
			showAddCompanyDialog: false,
			lastDisabled: true,
			nextDisabled: false,
			searchText: ''
		}

		this.fetchCompanyData = this.fetchCompanyData.bind(this);
		this.getCompanyTotals = this.getCompanyTotals.bind(this);

		this.tableHandleRowClick = this.tableHandleRowClick.bind(this);

		this.addOnClick = this.addOnClick.bind(this);
		this.deleteOnClick = this.deleteOnClick.bind(this);

		this.addDialogOnClose = this.addDialogOnClose.bind(this);

		this.onSortOptionChange = this.onSortOptionChange.bind(this);

		this.overviewBusinessOnClick = this.overviewBusinessOnClick.bind(this);

		this.lastPage = this.lastPage.bind(this);
		this.nextPage = this.nextPage.bind(this);

		this.searchOnChange = this.searchOnChange.bind(this);
}

	componentDidMount(){
		this.fetchCompanyData('name');
	}

	fetchCompanyData(sortParam = null, start = null, searchParam = undefined){

		let URL = process.env.REACT_APP_API_PATH + '/business?';
		if (start){
			URL = URL + 'start=' + start + '&end=' + this.state.tableMaxRows;
		}
		else {
			URL = URL + 'start=' + this.state.tableInitialIndex + '&end=' + this.state.tableMaxRows;
		}

		if (sortParam){
			URL = URL + '&sort=' + sortParam;
		} else {
			URL = URL + '&sort=' + this.state.sortOption;
		}

		if (searchParam !== undefined){
			URL = URL + '&search=' + searchParam;
		}
		else {
			URL = URL + '&search=' + this.state.searchText;
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
			return response.json();
		}).then(data => {
			if (data.length < this.state.tableMaxRows){
				this.setState({nextDisabled: true});
			}
			else {
				this.setState({nextDisabled: false});
			}
			this.setState({ companyTable:data });
			this.getCompanyTotals();
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	getCompanyTotals(){
		this.setState({
			revenueTotal:0.0,
			quantityTotal:0,
			expenseTotal:0.0,
			profitTotal:0.0,
			bankTotal:0.0,
			squareTotal:0.0
		});
		for (let i = 0; i < this.state.companyTable.length; i++){
			this.setState({
				revenueTotal:this.state.revenueTotal+parseFloat(this.state.companyTable[i].deposit_total),
				quantityTotal:this.state.quantityTotal+parseFloat(this.state.companyTable[i].product_count),
				expenseTotal:this.state.expenseTotal+parseFloat(this.state.companyTable[i].expense_total),
				profitTotal:this.state.profitTotal+parseFloat(this.state.companyTable[i].profit),
				bankTotal:this.state.bankTotal+parseFloat(this.state.companyTable[i].deposit_total),
				squareTotal:this.state.squareTotal+parseFloat(this.state.companyTable[i].square_total)
			});
		}
		this.setState({
			revenueTotal:this.state.revenueTotal.toFixed(2),
			expenseTotal:this.state.expenseTotal.toFixed(2),
			profitTotal:this.state.profitTotal.toFixed(2),
			bankTotal:this.state.bankTotal.toFixed(2),
			squareTotal:this.state.squareTotal.toFixed(2)
		});
	}

	tableHandleRowClick(index){
		if (index >= 0) {
			this.setState({deleteDisabled: false});
		}
		else {
			this.setState({deleteDisabled: true});
		}
		this.setState({selectedRow: index});
	}

	addOnClick(){
		this.setState({showAddCompanyDialog: true});
	}
	addDialogOnClose(){
		this.setState({showAddCompanyDialog: false});
	}

	deleteOnClick(){
		fetch(process.env.REACT_APP_API_PATH + '/business/bybid?bid=' + this.state.companyTable[this.state.selectedRow].company_id, {
			mode: 'cors',
			method: 'DELETE',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			if (Math.floor(response.status / 200) === 1) {
				if (this.state.companyTable.length === 1){
					this.setState({selectedRow: -1, deleteDisabled: true});
				}
				else if (this.state.selectedRow === this.state.companyTable.length - 1){
					this.setState({selectedRow: this.state.companyTable.length - 2});
				}
				this.fetchCompanyData();
				this.context.pushNotification('success', 'Company Deleted', 'Successfuly deleted company!', 4);
			}
			else {
				this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
			}

		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	//Sort Selection Functions
	onSortOptionChange(option){
		switch(option){
			case 'Instructor':
				this.setState({sortOption: 'instructor'});
				this.fetchCompanyData('instructor');
				break;
			case 'Section':
				this.setState({sortOption: 'section'});
				this.fetchCompanyData('section');
				break;
			case 'Name':
				this.setState({sortOption: 'name'});
				this.fetchCompanyData('name');
				break;
			default:
				this.fetchCompanyData();
		}
	}

	//Navigate to Business Overview Page
	overviewBusinessOnClick(){
		this.props.history.push("/instructor/dashboard/" + this.state.companyTable[this.state.selectedRow].company_id);
	}

	//Paging
	nextPage(){
		this.fetchTableData(null, this.state.tableInitialIndex + this.state.tableMaxRows);
		this.setState({tableInitialIndex: this.state.tableInitialIndex + this.state.tableMaxRows, lastDisabled: false});
		this.tableHandleRowClick(-1);
	}
	lastPage(){
		this.fetchTableData(null, this.state.tableInitialIndex - this.state.tableMaxRows);
		if (this.state.tableInitialIndex - this.state.tableMaxRows === 0){
			this.setState({tableInitialIndex: this.state.tableInitialIndex - this.state.tableMaxRows, lastDisabled: true, nextDisabled: false});
		}
		else {
			this.setState({tableInitialIndex: this.state.tableInitialIndex - this.state.tableMaxRows, lastDisabled: false, nextDisabled: false});
		}
		this.tableHandleRowClick(-1);
	}

	searchOnChange(text){
		this.setState({searchText: text, selectedRow: -1, deleteDisabled: true});
		this.fetchCompanyData(null, null, text);
	}

	render() {
		return (
			<>
				<div className='layout-tb-container'>
					<SearchBar className='layout-tb-search' onChange={this.searchOnChange}/>
					<p></p>
					<Table className='layout-tb-table'
							responsive
							size="sm" 
							bordered 
							hover 
							variant="dark">
							<thead>
								<tr>
									<th>Company</th>
									<th>Section</th>
									<th>Instructor</th>
									<th>Items Sold</th>
									<th>Bank</th>
									<th>Square</th>
									<th>Revenue</th>
									<th>Expenses</th>
									<th>Profits</th>
									<th>Sales Goals</th>
								</tr>
								<tr className='table-secondary-header'>
									<th>Total: {this.state.companyTable.length}</th>
									<th></th>
									<th></th>
									<th>{this.state.quantityTotal}</th>
									<th>${this.state.bankTotal}</th>
									<th>${this.state.squareTotal}</th>
									<th>${this.state.revenueTotal}</th>
									<th>${this.state.expenseTotal}</th>
									<th>${this.state.profitTotal}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.companyTable.map((business, index) => {
									const {instructor,
												section,
												transaction_total,
												deposit_total,
												product_count,
												expense_total,
												company_id,
												profit,
												profit_goal,
												stretch_profit_goal,
												square_total} = business;
									if (index === this.state.selectedRow){
										return (
											<tr key={company_id} className='selectedRow' onClick={() => this.tableHandleRowClick(index)}>
												<td>{company_id}</td>
												<td>{section}</td>
												<td>{instructor}</td>
												<td>{product_count}</td>
												<td>${deposit_total}</td>
												<td>${square_total}</td>
												<td>${transaction_total}</td>
												<td>${expense_total}</td>
												<td>${profit}</td>
												<td className='progress-column'><ProgressBarSmallProfit width={200} profit={profit} profitGoal={profit_goal} profitStretchGoal={stretch_profit_goal}/></td>
											</tr>
										);
									}
									else {
										return (
											<tr key={company_id} onClick={() => this.tableHandleRowClick(index)}>
												<td>{company_id}</td>
												<td>{section}</td>
												<td>{instructor}</td>
												<td>{product_count}</td>
												<td>${deposit_total}</td>
												<td>${square_total}</td>
												<td>${transaction_total}</td>
												<td>${expense_total}</td>
												<td>${profit}</td>
												<td className='progress-column'><ProgressBarSmallProfit width={200} profit={profit} profitGoal={profit_goal} profitStretchGoal={stretch_profit_goal}/></td>
											</tr>
										);
									}
								})}
							</tbody>
						</Table>
					<div className='layout-tb-controls'>
						<TableControl add addDisabled={this.state.addDisabled} addOnClick={this.addOnClick} delete deleteDisabled={this.state.deleteDisabled} deleteOnClick={this.deleteOnClick}/>
						<SortSelector options={['Instructor','Section','Name']} defaultOption={'Name'} onOptionChange={this.onSortOptionChange}/>
						<Button className='overview-button' onClick={this.overviewBusinessOnClick} disabled={this.state.deleteDisabled}>Overview Business</Button>
						<Button className='global-last-page-button' onClick={this.lastPage} disabled={this.state.lastDisabled}>{'<'}</Button>
						<Button className='global-next-page-button' onClick={this.nextPage} disabled={this.state.nextDisabled}>{'>'}</Button>
					</div>
				</div>
				<AddCompanyDialog show={this.state.showAddCompanyDialog} onClose={this.addDialogOnClose} onSuccess={this.fetchCompanyData}/>
			</>
		);
	}
}
CompanyManagementPage.contextType = AppContext;
