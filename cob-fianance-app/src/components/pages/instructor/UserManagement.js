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
			tableMaxRows: 18,
			tableInitialIndex: 0,
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
			sortOption: 'role',
			bid: 0,
			lastDisabled: true,
			nextDisabled: false
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

		this.lastPage = this.lastPage.bind(this);
		this.nextPage = this.nextPage.bind(this);
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

	fetchTableData(sortParam, start){
		let URL = API_PATH + '/user?';
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
			if (data.length < this.state.tableMaxRows){
				this.setState({nextDisabled: true});
			}
			else {
				this.setState({nextDisabled: false});
			}
			this.setState({tableRows:data});
		}).catch((error) => {
			this.sendNotification('fail', 'App Error', error.toString(), 0);
			console.log(error);
		});
	}

	//Table Function
	tableHandleRowClick(index){
		if (index >= 0) {
			this.setState({editDisabled: false, deleteDisabled: false});
		}
		else {
			this.setState({editDisabled: true, deleteDisabled: true});
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
			if (this.state.tableSelectedRow === this.state.tableRows.length - 1){
				this.setState({tableSelectedRow: this.state.tableRows.length - 2});
			}
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
		switch(option){
			case 'ONID':
				this.setState({sortOption: 'onid'});
				this.fetchTableData('onid');
				break;
			case 'Company':
				this.setState({sortOption: 'businessname'});
				this.fetchTableData('businessname');
				break;
			case 'First Name':
				this.setState({sortOption: 'first'});
				this.fetchTableData('first');
				break;
			case 'Last Name':
				this.setState({sortOption: 'last'});
				this.fetchTableData('last');
				break;
			case 'Role':
				this.setState({sortOption: 'role'});
				this.fetchTableData('role');
				break;
			default:
				this.fetchTableData();
		}
	}

	//Paging
	nextPage(){
		this.fetchTableData(null, this.state.tableInitialIndex + this.state.tableMaxRows);
		this.setState({tableInitialIndex: this.state.tableInitialIndex + this.state.tableMaxRows, lastDisabled: false})
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

	render(){
		return(
			<>
				<div className='user-management-container'>
					<div className='flex-container left'>
						<h2>Users</h2>
						<Button className='global-last-page-button' onClick={this.lastPage} disabled={this.state.lastDisabled}>Last Page</Button>
						<Button className='global-next-page-button' onClick={this.nextPage} disabled={this.state.nextDisabled}>Next Page</Button>
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
										const {
											uid,
											bid,
											name,
											first,
											last,
											section,
											role
										} = row;
										if (index === this.state.tableSelectedRow){
											return(
												<tr className='selectedRow' key={uid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{uid}</td>
													<td>{'(' + bid + ') ' + name}</td>
													<td>{last + ', ' + first}</td>
													<td>{section}</td>
													<td>{role}</td>
												</tr>
											);
										}
										else {
											return(
												<tr key={uid} onClick={() => this.tableHandleRowClick(index)}>
													<td>{uid}</td>
													<td>{'(' + bid + ') ' + name}</td>
													<td>{last + ', ' + first}</td>
													<td>{section}</td>
													<td>{role}</td>
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
						<SortSelector options={['ONID','Company','First Name', 'Last Name', 'Role']} defaultOption={'Role'} onOptionChange={this.onSortOptionChange}/>
						<div className='flex-container'>
							<Button onClick={()=>{this.setState({showImportUserDialog: true})}} style={{width: '100%'}}>Import Users</Button>
						</div>
					</div>
				</div>
				<AddUserDialog show={this.state.showAddUserDialog} handleSubmit={this.addDialogHandleSubmit} handleClose={this.addDialogHandleClose}/>

				<EditUserDialog show={this.state.showEditUserDialog} key={(this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].bid+this.state.tableRows[this.state.tableSelectedRow].uid} dataFromParent={{bid: (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].bid, uid: (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].uid}} handleSubmit={this.editDialogHandleSubmit} handleClose={this.editDialogHandleClose}/>

				<ImportUserDialog show={this.state.showImportUserDialog} handleSubmit={this.importDialogHandleSubmit} handleClose={this.importDialogHandleClose}/>

				<Notification key={this.state.showNotification} show={this.state.showNotification} type={this.state.notificationType} content={this.state.notificationContent} title={this.state.notificationTitle} onClose={this.notificationOnClose} timeout={this.state.notificationTimeout}/>
			</>
		);
	}

}
