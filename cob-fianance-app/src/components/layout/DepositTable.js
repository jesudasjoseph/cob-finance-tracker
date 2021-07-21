import React, {Component, PureComponent} from 'react';
import memoize from 'memoize-one';
import Table from 'react-bootstrap/Table';
import TableControl from './TableControl';

import { API_PATH } from '../Config';
import './styles/DepositTable.css';

export default class DepositTable extends PureComponent{
	constructor(props){
		super(props);
		this.state = {
			depositData: []
		}

		this.fetchDepositData = this.fetchDepositData.bind(this);
	}

	componentDidMount(){
		this.updateComponent(this.props.companyInfo);
	};

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
			this.setState({depositData:data, bid: bid});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	updateComponent = memoize((companyInfo) => {
			if (companyInfo.bid >= 0){
				this.fetchDepositData(companyInfo.bid);
				return {addDisabled: false, companyName: companyInfo.name};
			}
			else {
				return {addDisabled: true, companyName: 'Select a Company'};
			}
		}
	);

	render(){
		const {companyName, addDisabled} = this.updateComponent(this.props.companyInfo);

		if (addDisabled){
			return (<h2>{companyName}</h2>);
		}
		else {
			return(
				<>
					<div className='deposit-table-container'>
						<div className='flex-container left'>
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
						<div className='right'>
							<TableControl add addDisabled={addDisabled} addOnClick={this.addOnClick}/>
						</div>
					</div>
				</>
			);
		}
	}
}
