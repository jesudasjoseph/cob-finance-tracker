import React, {Component, PureComponent} from 'react';
import memoize from 'memoize-one';
import Table from 'react-bootstrap/Table';
import TableControl from './TableControl';
import SearchBar from './SearchBar';
import AddDepositDialog from './AddDepositDialog';

import { API_PATH } from '../Config';
import './styles/DepositTable.css';

export default class DepositTable extends PureComponent{
	constructor(props){
		super(props);
		this.state = {
			depositData: [],
			tableMaxRows: 18,
			tablePageIndex: 0,
			showAddDepositDialog: false,
			searchText: ''
		}

		this.fetchDepositData = this.fetchDepositData.bind(this);
		this.addOnClick = this.addOnClick.bind(this);

		this.handleSubmitDeposit = this.handleSubmitDeposit.bind(this);
		this.handleCloseDeposit = this.handleCloseDeposit.bind(this);
	}

	componentDidMount(){
		this.updateComponent(this.props.companyInfo);
	};

	fetchDepositData(bid, pageIndex, searchText = ''){
		fetch(API_PATH + '/deposit?start=' + pageIndex + '&end=' + this.state.tableMaxRows + '&bid=' + bid + '&search' + searchText, {
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
			this.setState({depositData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	updateComponent = memoize((companyInfo) => {
			if (companyInfo.bid >= 0){
				this.fetchDepositData(companyInfo.bid, this.state.tablePageIndex, this.state.searchText);
				return {addDisabled: false, companyName: companyInfo.name};
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
			this.fetchDepositData(this.props.companyInfo.bid, this.state.tablePageIndex);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	handleCloseDeposit() {
		this.setState({showAddDepositDialog: false});
	}

	searchOnChange(text){
		this.setState({searchText: text});
		this.fetchDepositData(this.props.companyInfo.bid, this.state.tablePageIndex, text);
	}

	render(){
		const {companyName, addDisabled} = this.updateComponent(this.props.companyInfo);

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
										const {d_id, date, uid, val, description} = deposit;
										return (
											<tr key={d_id}>
												<td>{date.split('T')[0]}</td>
												<td>{val}</td>
												<td>{uid}</td>
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
					<AddDepositDialog bid={this.props.companyInfo.bid} show={this.state.showAddDepositDialog} handleSubmit={this.handleSubmitDeposit} handleClose={this.handleCloseDeposit}/>
				</>
			);
		}
	}
}
