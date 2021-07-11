import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import TableControl from './TableControl.js';
import AddUserDialog from './AddUserDialog.js';
import EditUserDialog from './EditUserDialog.js';
import '../styles/UserManagementTable.css';

import {API_PATH} from '../Config.js';

export default class UserManagementTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			tableRows: [],
			tableSelectedRow: -1,
			addDisabled: false,
			editDisabled: true,
			deleteDisabled: true,
			showAddUserDialog: false,
			showEditUserDialog: false,
			bid: 0
		}

		this.fetchTableData = this.fetchTableData.bind(this);
		this.tableHandleRowClick = this.tableHandleRowClick.bind(this);

		this.addOnClick = this.addOnClick.bind(this);
		this.editOnClick = this.editOnClick.bind(this);
		this.deleteOnClick = this.deleteOnClick.bind(this);

		this.addDialogHandleSubmit = this.addDialogHandleSubmit.bind(this);
		this.addDialogHandleClose = this.addDialogHandleClose.bind(this);

		this.editDialogHandleSubmit = this.editDialogHandleSubmit.bind(this);
		this.editDialogHandleClose = this.editDialogHandleClose.bind(this);
	}

	componentDidMount(){
		this.fetchTableData();
	}

	fetchTableData(sortParam){
		let URL = API_PATH + '/user?start=0&end=50'
		if (sortParam){
			URL = URL + '&sort=' + sortParam;
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
			console.log('Success:', data);
			this.setState({tableRows:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	//Table Function
	tableHandleRowClick(index){
		if (index != null) {
			this.setState({editDisabled: false, deleteDisabled: false});
		}
		this.setState({tableSelectedRow: index});
	}

	//Table Control Functions
	addOnClick(){
		this.setState({showAddUserDialog: true});
	}
	editOnClick(){
		this.setState({showEditUserDialog: true});
	}
	deleteOnClick(){
		fetch(API_PATH + '/user/byuid?uid=' + this.state.tableRows[this.state.tableSelectedRow].uid, {
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
			this.fetchTableData();
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	//Add Dialog Functions
	addDialogHandleSubmit(userObject){
		const addUserToBusinessBody = {onid: userObject.uid, bid: userObject.bid};
		fetch(API_PATH + '/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(userObject)
		}).then(response => {
			console.log(response);
			fetch(API_PATH + '/user/addtobusiness', {
				mode: 'cors',
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json',
					'Authorization': window.localStorage.getItem('jwt')
				},
				body: JSON.stringify(addUserToBusinessBody)
			}).then(response => {
				console.log(response);
				this.fetchTableData();
			}).catch((error) => {
				console.error('Error:', error);
			});
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.setState({showAddUserDialog: false})
	}
	addDialogHandleClose(){
		this.setState({showAddUserDialog: false})
	}

	//Edit Dialog Functions
	editDialogHandleSubmit(dataObject){
		fetch(API_PATH + '/user/addtobusiness', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(dataObject)
		}).then(response => {
			this.fetchTableData();
			console.log(response);
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.setState({showEditUserDialog: false});
	}
	editDialogHandleClose(){
		this.setState({showEditUserDialog: false});
	}

	render(){
		return(
			<>
				<div className='user-management-container'>
					<div className='flex-container left'>
						<h2>User Management Table</h2>
						<Table size='sm' variant='dark' bordered hover responsive>
							<thead>
								<tr>
									<th>ONID</th>
									<th>Company</th>
									<th>Company ID</th>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Section</th>
									<th>Role</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.tableRows.map((row, index) => {
										if (index === this.state.tableSelectedRow){
											return(
												<tr className='selectedRow' key={this.state.tableRows[index].uid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{this.state.tableRows[index].uid}</td>
													<td>{this.state.tableRows[index].name}</td>
													<td>{this.state.tableRows[index].bid}</td>
													<td>{this.state.tableRows[index].first}</td>
													<td>{this.state.tableRows[index].last}</td>
													<td>{this.state.tableRows[index].section}</td>
													<td>{this.state.tableRows[index].role}</td>
												</tr>
											);
										}
										else {
											return(
												<tr key={this.state.tableRows[index].uid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{this.state.tableRows[index].uid}</td>
													<td>{this.state.tableRows[index].name}</td>
													<td>{this.state.tableRows[index].bid}</td>
													<td>{this.state.tableRows[index].first}</td>
													<td>{this.state.tableRows[index].last}</td>
													<td>{this.state.tableRows[index].section}</td>
													<td>{this.state.tableRows[index].role}</td>
												</tr>
											);
										}
									})
								}
							</tbody>
						</Table>
					</div>
					<TableControl className="right" add addDisabled={this.state.addDisabled} addOnClick={this.addOnClick} edit editDisabled={this.state.editDisabled} editOnClick={this.editOnClick} delete deleteDisabled={this.state.deleteDisabled} deleteOnClick={this.deleteOnClick}/>
				</div>
				<AddUserDialog show={this.state.showAddUserDialog} handleSubmit={this.addDialogHandleSubmit} handleClose={this.addDialogHandleClose}/>
				<EditUserDialog show={this.state.showEditUserDialog} key={(this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].bid+this.state.tableRows[this.state.tableSelectedRow].uid} dataFromParent={{bid: (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].bid, uid: (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].uid}} handleSubmit={this.editDialogHandleSubmit} handleClose={this.editDialogHandleClose}/>
			</>
		);
	}

}
