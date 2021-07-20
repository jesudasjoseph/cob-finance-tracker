import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ProgressBarSmallProfit from '../../layout/ProgressBarSmallProfit';
import SearchBar from '../../layout/SearchBar.js';
import TableControl from '../../layout/TableControl.js';
import AddCompanyDialog from '../../layout/AddCompanyDialog';
import SortSelector from '../../layout/SortSelector.js';
import Notification from '../../layout/Notification.js';
import { API_PATH } from '../../Config';

import '../../styles/CompanyManagementPage.css';

export default class CompanyManagementPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			businessTable: [],
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
			showNotification: false,
			notificationType: '',
			notificationTitle: '',
			notificationContent: '',
			notificationTimeout: 0,
			lastDisabled: true,
			nextDisabled: false,
			searchText: ''
		}

		this.fetchBusinessData = this.fetchBusinessData.bind(this);
		this.getBusinessTotals = this.getBusinessTotals.bind(this);

		this.tableHandleRowClick = this.tableHandleRowClick.bind(this);

		this.sendNotification = this.sendNotification.bind(this);
		this.notificationOnClose = this.notificationOnClose.bind(this);

		this.addOnClick = this.addOnClick.bind(this);
		this.deleteOnClick = this.deleteOnClick.bind(this);

		this.addDialogHandleSubmit = this.addDialogHandleSubmit.bind(this);
		this.addDialogHandleClose = this.addDialogHandleClose.bind(this);

		this.onSortOptionChange = this.onSortOptionChange.bind(this);

		this.overviewBusinessOnClick = this.overviewBusinessOnClick.bind(this);

		this.lastPage = this.lastPage.bind(this);
		this.nextPage = this.nextPage.bind(this);

		this.searchOnChange = this.searchOnChange.bind(this);
}

	componentDidMount(){
		this.fetchBusinessData('name');
	}

	fetchBusinessData(sortParam, start, searchParam){

		let URL = API_PATH + '/business?';
		if (start != null){
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

		if (searchParam === undefined){
			URL = URL + '&search=' + this.state.searchText;
		}
		else {
			URL = URL + '&search=' + searchParam;
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
			if (data.length < this.state.tableMaxRows){
				this.setState({nextDisabled: true});
			}
			else {
				this.setState({nextDisabled: false});
			}
			this.setState({ businessTable:data });
			this.getBusinessTotals();
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	getBusinessTotals(){
		this.setState({
			revenueTotal:0.0,
			quantityTotal:0,
			expenseTotal:0.0,
			profitTotal:0.0,
			bankTotal:0.0,
			squareTotal:0.0
		});
		for (let i = 0; i < this.state.businessTable.length; i++){
			this.setState({
				revenueTotal:this.state.revenueTotal+parseFloat(this.state.businessTable[i].deposit_total),
				quantityTotal:this.state.quantityTotal+parseFloat(this.state.businessTable[i].product_count),
				expenseTotal:this.state.expenseTotal+parseFloat(this.state.businessTable[i].expense_total),
				profitTotal:this.state.profitTotal+parseFloat(this.state.businessTable[i].profit),
				bankTotal:this.state.bankTotal+parseFloat(this.state.businessTable[i].deposit_total),
				squareTotal:this.state.squareTotal+parseFloat(this.state.businessTable[i].square_total)
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

	sendNotification(type, title, content, timeout){

		this.setState({
			showNotification: true,
			notificationType: type,
			notificationTitle: title,
			notificationContent: content,
			notificationTimeout: timeout
		});
	}
	notificationOnClose(){
		this.setState({showNotification: false});
	}

	addOnClick(){
		this.setState({showAddCompanyDialog: true});
	}
	deleteOnClick(){
		fetch(API_PATH + '/business/bybid?bid=' + this.state.businessTable[this.state.selectedRow].bid, {
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
			if (this.state.businessTable.length === 1){
				this.setState({selectedRow: -1, deleteDisabled: true});
			}
			else if (this.state.selectedRow === this.state.businessTable.length - 1){
				this.setState({selectedRow: this.state.businessTable.length - 2});
			}
			this.fetchBusinessData();
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	addDialogHandleSubmit(businessObject){
		const businessBody = {business:businessObject}
		fetch(API_PATH + '/business', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(businessBody)
		}).then(response => {
			if (Math.floor(response.status / 200) === 1){
				this.sendNotification('success', 'Successfully Added New Business', '', 4000);

			}
			else{
				this.sendNotification('fail', 'Network Error', response.status + ': ' + response.statusText, 0);
			}
			this.fetchBusinessData(this.state.sortOption);
		}).catch((error) => {
			this.sendNotification('fail', 'App Error', error.toString(), 0);
		});
		this.setState({showAddCompanyDialog: false});
	}
	addDialogHandleClose(){
		this.setState({showAddCompanyDialog: false});
	}

	//Sort Selection Functions
	onSortOptionChange(option){
		switch(option){
			case 'Instructor':
				this.setState({sortOption: 'instructor'});
				this.fetchBusinessData('instructor');
				break;
			case 'Section':
				this.setState({sortOption: 'section'});
				this.fetchBusinessData('section');
				break;
			case 'Name':
				this.setState({sortOption: 'name'});
				this.fetchBusinessData('name');
				break;
			default:
				this.fetchBusinessData();
		}
	}

	//Navigate to Business Overview Page
	overviewBusinessOnClick(){
		this.props.history.push("/instructor/dashboard/" + this.state.businessTable[this.state.selectedRow].bid);
	}

	//Paging
	nextPage(){
		this.fetchTableData(null, this.state.tableInitialIndex + this.state.tableMaxRows);
		this.setState({tableInitialIndex: this.state.tableInitialIndex + this.state.tableMaxRows, lastDisabled: false});
		this.tableHandleRowClick(-1);
	}
	lastPage(){
		this.fetchTableData(null, this.state.tableInitialIndex - this.state.tableMaxRows);
		if (this.state.tableInitialIndex - this.state.tableMaxRows == 0){
			this.setState({tableInitialIndex: this.state.tableInitialIndex - this.state.tableMaxRows, lastDisabled: true, nextDisabled: false});
		}
		else {
			this.setState({tableInitialIndex: this.state.tableInitialIndex - this.state.tableMaxRows, lastDisabled: false, nextDisabled: false});
		}
		this.tableHandleRowClick(-1);
	}

	searchOnChange(text){
		this.setState({searchText: text});
		this.fetchBusinessData(null, null, text);
	}

	render() {
		return (
			<>
				<div className='company-management-container'>
					<div className='left'>
						<SearchBar onChange={this.searchOnChange}/>
						<div className='flex-container'>
							<h2>Companies</h2>
							<Button className='global-last-page-button' onClick={this.lastPage} disabled={this.state.lastDisabled}>Last Page</Button>
							<Button className='global-next-page-button' onClick={this.nextPage} disabled={this.state.nextDisabled}>Next Page</Button>
							<Table responsive size="sm" bordered hover variant="dark">
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
										<th>Total: {this.state.businessTable.length}</th>
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
										this.state.businessTable.map((business, index) => {
										const {name,
													instructor,
													section,
													transaction_total,
													deposit_total,
													product_count,
													expense_total,
													bid,
													profit,
													profit_goal,
													stretch_profit_goal,
													square_total} = business;
										if (index === this.state.selectedRow){
											return (
												<tr key={bid} className='selectedRow' onClick={() => this.tableHandleRowClick(index)}>
													<td>{name + ' ('+ bid + ')'}</td>
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
												<tr key={bid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{name + ' ('+ bid + ')'}</td>
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
						</div>
					</div>
					<div className='right'>
						<TableControl add addDisabled={this.state.addDisabled} addOnClick={this.addOnClick} delete deleteDisabled={this.state.deleteDisabled} deleteOnClick={this.deleteOnClick}/>
						<SortSelector options={['Instructor','Section','Name']} defaultOption={'Name'} onOptionChange={this.onSortOptionChange}/>
						<div className='flex-container'>
							<Button className='overview-button' onClick={this.overviewBusinessOnClick} disabled={this.state.deleteDisabled}>Overview Business</Button>
						</div>
					</div>
				</div>
				<AddCompanyDialog show={this.state.showAddCompanyDialog} handleSubmit={this.addDialogHandleSubmit} handleClose={this.addDialogHandleClose}/>
				<Notification show={this.state.showNotification} type={this.state.notificationType} content={this.state.notificationContent} title={this.state.notificationTitle} onClose={this.notificationOnClose} timeout={this.state.notificationTimeout}/>
			</>
		);
	}
}
