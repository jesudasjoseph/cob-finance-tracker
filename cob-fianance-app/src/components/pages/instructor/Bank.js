import React from 'react';
import Table from 'react-bootstrap/Table';
import AddDepositDialogButton from '../../layout/AddDepositDialogButton';
import { API_PATH } from '../../Config';

import '../../styles/Bank.css';

export default class Bank extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			depositData: [],
			businessData: [],
			businessTableSelectedRow: -1,
			depositTableMaxRows: 18,
			depositTableInitialIndex: 0
		};

		this.fetchDepositData = this.fetchDepositData.bind(this);
		this.fetchBusinessData = this.fetchBusinessData.bind(this);

		this.businessTableRowClickHandler = this.businessTableRowClickHandler.bind(this);

		this.onDepositAdd = this.onDepositAdd.bind(this);
	}

	componentDidMount(){
		this.fetchBusinessData();
	}

	fetchBusinessData(){
		fetch(API_PATH + '/business/names', {
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
			this.setState({businessData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	fetchDepositData(bid){
		fetch(API_PATH + '/deposit?start=0&end=50&bid=' + bid, {
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

	businessTableRowClickHandler(index){
		this.setState({businessTableSelectedRow: index});
		this.fetchDepositData(this.state.businessData[index].bid);
	}

	onDepositAdd(){
		this.fetchDepositData(this.state.selectedBid);
	}

	render () {
		return(
			<>
			<div className='bank-container'>
				<div className='left'>
					<div className='flex-container'>
						<Table responsive size="sm" bordered hover variant="dark">
							<thead>
								<tr>
									<th>Select Company</th>
								</tr>
							</thead>
							<tbody>
								{this.state.businessData.map((business, index) => {
									const {name, bid} = business;
									if (this.state.businessTableSelectedRow === index){
										return (
											<tr className='selectedRow' key={bid} onClick={() => this.businessTableRowClickHandler(index)}>
												<td>{name}</td>
											</tr>
										);
									}
									else{
										return (
											<tr key={bid} onClick={() => this.businessTableRowClickHandler(index)}>
												<td>{name}</td>
											</tr>
										);
									}
								})}
							</tbody>
						</Table>
					</div>
				</div>
				<div className='middle'>
					<div className='flex-container'>
						<h2>{}</h2>
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
					<div className='flex-container'>
						<AddDepositDialogButton bid={0} onSave={this.onDepositAdd} style={{margin: '20px'}}/>
					</div>
				</div>
			</div>
			</>
		);
		/*
		if (this.state.selectedBid == null) {
			return (
				<React.Fragment>
				<div style={{display: 'grid', gridTemplateColumns: '20% 70% 10%'}}>
					<div style={{margin: '20px'}}>
						<Table responsive="sm" size="xl" striped bordered hover variant="dark">
							<thead>
								<tr>
									<th>Company</th>
								</tr>
							</thead>
							<tbody>
								{this.state.businessData.map((business, index) => {
									const {name, bid} = business;
									return (
										<tr key={bid} style={{cursor: 'pointer'}} onClick={() => this.businessTableRowClickHandler(bid, name)}>
											<td>{name}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</div>
					<div style={{margin: '20px'}}>
						<h4 style={{color: 'red'}}>Select a company!</h4>
					</div>
					<div style={{margin: '20px'}}>
					</div>
				</div>
				</React.Fragment>
			);
		}
		else if (this.state.depositData != null && this.state.depositData.length ) {
			return (
				<React.Fragment>
					<div  style={{display: 'grid', gridTemplateColumns: '20% 70% 10%'}}>
						<div style={{margin: '20px'}}>
							<Table responsive="sm" size="xl" striped bordered hover variant="dark">
								<thead>
									<tr>
										<th>Company</th>
									</tr>
								</thead>
								<tbody>
									{this.state.businessData.map((business, index) => {
										const {name, bid} = business;
										return (
											<tr key={bid} style={{cursor: 'pointer'}} onClick={() => this.businessTableRowClickHandler(bid, name)}>
												<td>{name}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</div>
						<div style={{margin: '20px'}}>
							<h2>{this.state.businessName}</h2>
							<Table responsive="sm" size="xl" striped bordered hover variant="dark">
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
						<div style={{margin: '20px'}}>
							<AddDepositDialogButton onSave={this.onDepositAdd} bid={this.state.selectedBid} style={{margin: '20px'}}/>
						</div>
					</div>
				</React.Fragment>
			);
		}
		else {
			return (
				<React.Fragment>
				<div style={{display: 'grid', gridTemplateColumns: '20% 70% 10%'}}>
					<div style={{margin: '20px'}}>
						<Table responsive="sm" size="xl" striped bordered hover variant="dark">
							<thead>
								<tr>
									<th>Company</th>
								</tr>
							</thead>
							<tbody>
								{this.state.businessData.map((business, index) => {
									const {name, bid} = business;
									return (
										<tr key={bid} style={{cursor: 'pointer'}} onClick={() => this.businessTableRowClickHandler(bid, name)}>
											<td>{name}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</div>
					<div style={{margin: '20px'}}>
						<h2>{this.state.businessName}</h2>
						<h4 style={{color: 'red'}}>This company has no deposits!</h4>
					</div>
					<div style={{margin: '20px'}}>
						<AddDepositDialogButton bid={this.state.selectedBid} style={{margin: '20px'}}/>
					</div>
				</div>
				</React.Fragment>
			);
		}
		*/
	}
}
