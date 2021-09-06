import React, {PureComponent} from 'react';
import memoize from 'memoize-one';
import Table from 'react-bootstrap/Table';
import TableControl from './TableControl';
import SearchBar from './SearchBar';
import AddDepositDialog from './AddDepositDialog';

import {AppContext} from '../../AppContext';

import { API_PATH } from '../Config';
import './styles/DepositTable.css';

export default class DepositTable extends PureComponent{
	constructor(props){
		super(props);
		this.state = {
			depositData: [],
			tableMaxRows: 100,
			tablePageIndex: 0,
			showAddDepositDialog: false,
			searchText: ''
		}

		this.fetchDepositData = this.fetchDepositData.bind(this);
		this.addOnClick = this.addOnClick.bind(this);

		this.handleSubmitDeposit = this.handleSubmitDeposit.bind(this);
		this.handleCloseDeposit = this.handleCloseDeposit.bind(this);

		this.searchOnChange = this.searchOnChange.bind(this);
	}

	componentDidMount(){
		this.updateComponent(this.props.companyInfo);
	};

	fetchDepositData(company_id, pageIndex, searchText = ''){
		fetch(API_PATH + '/deposit/bybid?start=' + pageIndex + '&end=' + this.state.tableMaxRows + '&bid=' + company_id + '&search=' + searchText, {
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
			this.setState({depositData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	updateComponent = memoize((company_id) => {
			if (company_id != null){
				this.fetchDepositData(company_id, this.state.tablePageIndex, this.state.searchText);
				return {addDisabled: false, companyName: company_id};
			}
			else {
				return {addDisabled: true, companyName: 'Select a Company'};
			}
		}
	);

	addOnClick() {
		this.setState({showAddDepositDialog: true});
	}

	handleSubmitDeposit(depositObject) {
		this.setState({showAddDepositDialog: false});
		const depositBody = {deposit: depositObject}
		fetch(API_PATH + '/deposit', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(depositBody)
		}).then((response) => {
			if (Math.floor(response.status / 200) === 1){
				this.context.pushNotification('success', 'Deposite Added', 'Successfully added deposit!', 4);
				this.fetchDepositData(this.props.company_id, this.state.tablePageIndex, this.state.searchText);
			}
			else{
				this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
			}
		}).catch((error) => {
			console.error('Error:', error);
			this.context.pushNotification('error', 'App Error', error.toString(), 8);
		});
	}
	handleCloseDeposit() {
		this.setState({showAddDepositDialog: false});
	}

	searchOnChange(text){
		this.setState({searchText: text});
		this.fetchDepositData(this.props.company_id, this.state.tablePageIndex, text);
	}

	render(){
		const {companyName, addDisabled} = this.updateComponent(this.props.company_id);

		if (addDisabled){
			return (<h2>{companyName}</h2>);
		}
		else {
			return(
				<>
					<div className='deposit-table-container'>
						<div className='left'>
							<SearchBar onChange={this.searchOnChange}/>
							<div className='flex-container'>
							<h2>{companyName} - Bank Deposit</h2>
							<Table responsive size="sm" striped bordered hover variant="dark">
								<thead>
									<tr>
										<th>Date</th>
										<th>Amount</th>
										<th>ONID</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{this.state.depositData.map((deposit, index) => {
										const {deposit_id, date, user_id, value, description} = deposit;
										return (
											<tr key={deposit_id}>
												<td>{date.split('T')[0]}</td>
												<td>{value}</td>
												<td>{user_id}</td>
												<td>{description}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
							</div>
						</div>
						<div className='right'>
							<TableControl add addDisabled={addDisabled} addOnClick={this.addOnClick}/>
						</div>
					</div>
					<AddDepositDialog company_id={this.props.company_id} show={this.state.showAddDepositDialog} handleSubmit={this.handleSubmitDeposit} handleClose={this.handleCloseDeposit}/>
				</>
			);
		}
	}
}
DepositTable.contextType = AppContext;
