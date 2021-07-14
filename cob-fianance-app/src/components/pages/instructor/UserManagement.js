import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import TableControl from '../../layout/TableControl.js';
import AddUserDialog from '../../layout/AddUserDialog.js';
import EditUserDialog from '../../layout/EditUserDialog.js';
import SortSelector from '../../layout/SortSelector.js';
import ImportUserDialog from '../../layout/ImportUserDialog.js';
import Notification from '../../layout/Notification.js';

import '../../styles/UserManagement.css';

import {API_PATH} from '../../Config.js';

export default class UserManagement extends Component {
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
			showNotification: false,
			notificationType: 'success',
			notificationContent: '',
			notificationTitle: '',
			notificationTimeout: 0,
			sortOption: 'Role',
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

		this.importDialogHandleSubmit = this.importDialogHandleSubmit.bind(this);
		this.importDialogHandleClose = this.importDialogHandleClose.bind(this);

		this.onSortOptionChange = this.onSortOptionChange.bind(this);

		this.sendNotification = this.sendNotification.bind(this);
		this.notificationOnClose = this.notificationOnClose.bind(this);
	}

	componentDidMount(){
		this.fetchTableData();
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
			if (Math.floor(response.status / 200) === 1){
				return response.json();
			}
			else {
				this.sendNotification('fail', 'Network Error', response.status+': '+response.statusText, 0);
				return [];
			}
		}).then((data) => {
			this.setState({tableRows:data});
		}).catch((error) => {
			this.sendNotification('fail', 'App Error', error.toString(), 0);
			console.log(error);
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
		const userBody = {user: {uid: userObject.uid, bid: userObject.bid, first: userObject.firstName, last: userObject.lastName, section: userObject.section, role: userObject.role}}
		const addUserToBusinessBody = {uid: userObject.uid, bid: userObject.bid};
		fetch(API_PATH + '/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(userBody)
		}).then(response => {
			if (Math.floor(response.status / 200) === 1){
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
					if (Math.floor(response.status / 200) === 1){
						this.sendNotification('success', 'Successfully Added New User', '', 4000);
					}
					else{
						this.sendNotification('fail', 'Network Error', response.status + ': ' + response.statusText, 0);
					}
					this.fetchTableData(this.state.sortOption);
				}).catch((error) => {
					this.sendNotification('fail', 'App Error', error.toString(), 0);
				});
			}
			else {
				this.sendNotification('fail', 'Network Error', response.status + ': ' + response.statusText, 0);
			}
		}).catch((error) => {
			this.sendNotification('fail', 'App Error', error.toString(), 0);
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
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.setState({showEditUserDialog: false});
	}
	editDialogHandleClose(){
		this.setState({showEditUserDialog: false});
	}

	//Import Dialog Functions
	importDialogHandleSubmit(userObject){
		this.setState({showImportUserDialog: false});
	}
	importDialogHandleClose(){
		this.setState({showImportUserDialog: false});
	}

	//Sort Selection Functions
	onSortOptionChange(option){
		this.setState({sortOption: option});
		switch(option){
			case 'ONID':
				this.fetchTableData('onid');
				break;
			case 'Company':
				this.fetchTableData('businessname');
				break;
			case 'First Name':
				this.fetchTableData('first');
				break;
			case 'Last Name':
				this.fetchTableData('last');
				break;
			case 'Role':
				this.fetchTableData('role');
				break;
			default:
				this.fetchTableData();
		}
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
									<th>Name</th>
									<th>Section</th>
									<th>Role</th>
								</tr>
								<tr className='table-secondary-header'>
									<th></th>
									<th>(ID) Name</th>
									<th>Last, First</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.tableRows.map((row, index) => {
										if (index === this.state.tableSelectedRow){
											return(
												<tr className='selectedRow' key={this.state.tableRows[index].uid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{this.state.tableRows[index].uid}</td>
													<td>{'(' + this.state.tableRows[index].bid + ') ' + this.state.tableRows[index].name}</td>
													<td>{this.state.tableRows[index].last + ', ' + this.state.tableRows[index].first}</td>
													<td>{this.state.tableRows[index].section}</td>
													<td>{this.state.tableRows[index].role}</td>
												</tr>
											);
										}
										else {
											return(
												<tr key={this.state.tableRows[index].uid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{this.state.tableRows[index].uid}</td>
													<td>{'(' + this.state.tableRows[index].bid + ') ' + this.state.tableRows[index].name}</td>
													<td>{this.state.tableRows[index].last + ', ' + this.state.tableRows[index].first}</td>
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
					<div className='right'>
						<TableControl add addDisabled={this.state.addDisabled} addOnClick={this.addOnClick} edit editDisabled={this.state.editDisabled} editOnClick={this.editOnClick} delete deleteDisabled={this.state.deleteDisabled} deleteOnClick={this.deleteOnClick}/>
						<SortSelector options={['ONID','Company','First Name', 'Last Name', 'Role']} defaultOption={this.state.sortOption} onOptionChange={this.onSortOptionChange}/>
						<div className='flex-container'>
							<Button onClick={()=>{this.setState({showImportUserDialog: true})}} style={{width: '100%'}}>Import Users</Button>
						</div>
					</div>
				</div>
				<AddUserDialog show={this.state.showAddUserDialog} handleSubmit={this.addDialogHandleSubmit} handleClose={this.addDialogHandleClose}/>

				<EditUserDialog show={this.state.showEditUserDialog} key={(this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].bid+this.state.tableRows[this.state.tableSelectedRow].uid} dataFromParent={{bid: (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].bid, uid: (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].uid}} handleSubmit={this.editDialogHandleSubmit} handleClose={this.editDialogHandleClose}/>

				<ImportUserDialog show={this.state.showImportUserDialog} handleSubmit={this.importDialogHandleSubmit} handleClose={this.importDialogHandleClose}/>

				<Notification show={this.state.showNotification} type={this.state.notificationType} content={this.state.notificationContent} title={this.state.notificationTitle} onClose={this.notificationOnClose} timeout={this.state.notificationTimeout}/>
			</>
		);
	}

}
