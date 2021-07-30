import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import DepositTable from '../../layout/DepositTable';
import { API_PATH } from '../../Config';

import './styles/Bank.css';

export default class Bank extends Component{
	constructor(props){
		super(props);
		this.state = {
			depositData: [],
			businessData: [],
			businessTableSelectedRow: -1,
			depositTableMaxRows: 18,
			depositTableInitialIndex: 0,
			selectedCompanyInfo: {company_id: ''}
		};

		this.fetchBusinessData = this.fetchBusinessData.bind(this);

		this.businessTableRowClickHandler = this.businessTableRowClickHandler.bind(this);
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
			return response.json();
		}).then(data => {
			this.setState({businessData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	businessTableRowClickHandler(index){
		this.setState({businessTableSelectedRow: index, selectedCompanyInfo: {company_id: this.state.businessData[index].company_id}});
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
									const {company_id} = business;
									if (this.state.businessTableSelectedRow === index){
										return (
											<tr className='selectedRow' key={company_id} onClick={() => this.businessTableRowClickHandler(index)}>
												<td>{company_id}</td>
											</tr>
										);
									}
									else{
										return (
											<tr key={company_id} onClick={() => this.businessTableRowClickHandler(index)}>
												<td>{company_id}</td>
											</tr>
										);
									}
								})}
							</tbody>
						</Table>
					</div>
				</div>
				<div className='right'>
					<DepositTable companyInfo={this.state.selectedCompanyInfo}/>
				</div>
			</div>
			</>
		);
	}
}
