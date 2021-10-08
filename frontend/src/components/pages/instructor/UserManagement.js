import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import SearchBar from '../../layout/SearchBar.js';
import TableControl from '../../layout/TableControl.js';
import AddUserDialog from '../../layout/AddUserDialog.js';
import EditUserDialog from '../../layout/EditUserDialog.js';
import SortSelector from '../../layout/SortSelector.js';
import ImportUserDialog from '../../layout/ImportUserDialog.js';

import { AppContext } from '../../../AppContext';

import './styles/UserManagement.css';

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
			sortOption: 'role',
			company_id: '',
			lastDisabled: true,
			nextDisabled: false,
			searchText: '',
			loginAsUserDisabled: true
		}

		this.fetchTableData = this.fetchTableData.bind(this);
		this.tableHandleRowClick = this.tableHandleRowClick.bind(this);

		this.addOnClick = this.addOnClick.bind(this);
		this.editOnClick = this.editOnClick.bind(this);
		this.deleteOnClick = this.deleteOnClick.bind(this);

		this.addDialogOnClose = this.addDialogOnClose.bind(this);
		this.editDialogOnClose = this.editDialogOnClose.bind(this);

		this.importDialogHandleSubmit = this.importDialogHandleSubmit.bind(this);
		this.importDialogHandleClose = this.importDialogHandleClose.bind(this);

		this.onSortOptionChange = this.onSortOptionChange.bind(this);

		this.lastPage = this.lastPage.bind(this);
		this.nextPage = this.nextPage.bind(this);

		this.searchOnChange = this.searchOnChange.bind(this);

		this.onLoginAsUserClick = this.onLoginAsUserClick.bind(this);
	}

	componentDidMount(){
		this.fetchTableData();
	}

	fetchTableData(sortParam = null, start = null, searchParam = undefined){
		let URL = process.env.REACT_APP_API_PATH + '/user?';
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
			if (Math.floor(response.status / 200) === 1){
				return response.json();
			}
			else {
				this.context.pushNotification('fail', 'Network Error', response.status+': '+response.statusText, 0);
				return [];
			}
		}).then((data) => {
			if (data.length < this.state.tableMaxRows){
				this.setState({nextDisabled: true});
			}
			else {
				this.setState({nextDisabled: false});
			}
			console.log(data);
			this.setState({tableRows:data});
		}).catch((error) => {
			this.context.pushNotification('fail', 'App Error', error.toString(), 0);
			console.log(error);
		});
	}

	//Table Function
	tableHandleRowClick(index){
		if (index >= 0) {
			this.setState({editDisabled: false, deleteDisabled: false});
			if (this.state.tableRows[index].role === 0){
				this.setState({loginAsUserDisabled: false});
			}
			else {
				this.setState({loginAsUserDisabled: true});
			}
		}
		else {
			this.setState({editDisabled: true, deleteDisabled: true, loginAsUserDisabled: true});
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
		fetch(process.env.REACT_APP_API_PATH + '/user/byuid?uid=' + this.state.tableRows[this.state.tableSelectedRow].user_id, {
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
				if (this.state.tableSelectedRow === this.state.tableRows.length - 1){
					this.setState({tableSelectedRow: this.state.tableRows.length - 2});
					if (this.state.tableRows[this.state.tableRows.length - 2].role === 0){
						this.setState({loginAsUserDisabled: true});
					}
					else{
						this.setState({loginAsUserDisabled: false});
					}
				}
				this.fetchTableData();
				this.context.pushNotification('success', 'Deleted', 'Successfully deleted user', 4);
			}
			else {
				this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	//Add Dialog Functions
	addDialogOnClose(){
		this.setState({showAddUserDialog: false})
	}

	//Edit Dialog Functions
	editDialogOnClose(){
		this.setState({showEditUserDialog: false});
	}

	//Import Dialog Functions
	importDialogHandleSubmit(userObject){
		this.setState({showImportUserDialog: false});
	}
	importDialogHandleClose(){
		this.setState({showImportUserDialog: false});
	}

	onLoginAsUserClick(){
		fetch(process.env.REACT_APP_API_PATH + '/auth?user_id=' + this.state.tableRows[this.state.tableSelectedRow].user_id, {
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
				window.localStorage.setItem('jwt_admin', window.localStorage.getItem('jwt'));
				window.localStorage.setItem('role_admin', window.localStorage.getItem('role'));
				window.localStorage.setItem('user_id_admin', window.localStorage.getItem('user_id'));

				window.localStorage.setItem('jwt',"Bearer " + data.token);
				window.localStorage.setItem('role', data.role);
				window.localStorage.setItem('user_id', data.user_id);

				this.context.setLoginState(true);

				this.props.history.push('/student/dashboard');
			}).catch((error) => {
				console.error('Error:', error);
			});
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
		if (this.state.tableInitialIndex - this.state.tableMaxRows === 0){
			this.setState({tableInitialIndex: this.state.tableInitialIndex - this.state.tableMaxRows, lastDisabled: true, nextDisabled: false});
		}
		else {
			this.setState({tableInitialIndex: this.state.tableInitialIndex - this.state.tableMaxRows, lastDisabled: false, nextDisabled: false});
		}
		this.tableHandleRowClick(-1);
	}

	//Search Function
	searchOnChange(text){
		this.setState({searchText: text, tableSelectedRow: -1});
		this.fetchTableData(null, null, text);
	}

	render(){
		return(
			<>
				<div className='layout-tb-container'>
					<SearchBar className='layout-tb-search' onChange={this.searchOnChange}/>
					<p></p>
					<Table className='layout-tb-table' size='sm' variant='dark' bordered hover responsive>
							<thead>
							<tr>
								<th>UID</th>
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
										user_id,
										company_id,
										first_name,
										last_name,
										section,
										role
									} = row;
									if (index === this.state.tableSelectedRow){
										return(
											<tr className='selectedRow' key={user_id} onClick={() => this.tableHandleRowClick(index)}>
												<td>{user_id}</td>
												<td>{company_id}</td>
												<td>{last_name + ', ' + first_name}</td>
												<td>{section}</td>
												<td>{role}</td>
											</tr>
										);
									}
									else {
										return(
											<tr key={user_id} onClick={() => this.tableHandleRowClick(index)}>
												<td>{user_id}</td>
												<td>{company_id}</td>
												<td>{last_name + ', ' + first_name}</td>
												<td>{section}</td>
												<td>{role}</td>
											</tr>
										);
									}
								})
							}
							</tbody>
					</Table>
					<div className='layout-tb-controls'>
						<TableControl add addDisabled={this.state.addDisabled} addOnClick={this.addOnClick} edit editDisabled={this.state.editDisabled} editOnClick={this.editOnClick} delete deleteDisabled={this.state.deleteDisabled} deleteOnClick={this.deleteOnClick}/>
						<SortSelector options={['ONID','Company','First Name', 'Last Name', 'Role']} defaultOption={'Role'} onOptionChange={this.onSortOptionChange}/>
						<div className='flex-container'>
							<Button onClick={()=>{this.setState({showImportUserDialog: true})}} style={{width: '100%'}}>Import Users</Button>
							<Button disabled={this.state.loginAsUserDisabled} onClick={this.onLoginAsUserClick} style={{width: '100%'}}>Login as User</Button>
						</div>
						<Button className='global-last-page-button' onClick={this.lastPage} disabled={this.state.lastDisabled}>{'<'}</Button>
						<Button className='global-next-page-button' onClick={this.nextPage} disabled={this.state.nextDisabled}>{'>'}</Button>
					</div>
				</div>
				<AddUserDialog show={this.state.showAddUserDialog} onClose={this.addDialogOnClose} onSuccess={this.fetchTableData}/>

				<EditUserDialog show={this.state.showEditUserDialog} key={(this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].company_id+this.state.tableRows[this.state.tableSelectedRow].user_id} company_id={ (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].company_id} user_id={ (this.state.tableSelectedRow === -1) ? -1 : this.state.tableRows[this.state.tableSelectedRow].user_id} onClose={this.editDialogOnClose} onSuccess={this.fetchTableData}/>

				<ImportUserDialog show={this.state.showImportUserDialog} handleSubmit={this.importDialogHandleSubmit} handleClose={this.importDialogHandleClose}/>
			</>
		);
	}
}
UserManagement.contextType = AppContext;
