import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import AddStudentDialogButton from './AddStudentDialogButton.js';
import ImportStudentButton from './ImportStudentButton.js'
import { API_PATH } from '../Config';

export class Tables extends Component {
	constructor(props){
		super(props);
		this.state = {
			userTable: [],
			selectedRow: undefined
		};
		this.fetchUserData = this.fetchUserData.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.sortByOnidClickHandler = this.sortByOnidClickHandler.bind(this);
		this.sortByBusinessNameClickHandler = this.sortByBusinessNameClickHandler.bind(this);
		this.sortByFirstNameClickHandler = this.sortByFirstNameClickHandler.bind(this);
		this.sortByLastNameClickHandler = this.sortByLastNameClickHandler.bind(this);
		this.sortByRoleClickHandler = this.sortByRoleClickHandler.bind(this);
		this.handleDeleteUserButton = this.handleDeleteUserButton.bind(this);
	}

	componentDidMount(){
		this.fetchUserData('role');
	}

	fetchUserData(sortParam){

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
			this.setState({userTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handleRowClick(index){
		if (this.state.selectedRow === undefined){
			this.setState({selectedRow:index});
		}
		else if (this.state.selectedRow === index){
			this.setState({selectedRow:undefined});
		}
		else{
			this.setState({selectedRow:index});
		}
	}

	sortByOnidClickHandler(){
		this.fetchUserData('onid');
		this.setState({selectedRow:undefined});
	}
	sortByBusinessNameClickHandler(){
		this.fetchUserData('businessname');
		this.setState({selectedRow:undefined});
	}
	sortByFirstNameClickHandler(){
		this.fetchUserData('first');
		this.setState({selectedRow:undefined});
	}
	sortByLastNameClickHandler(){
		this.fetchUserData('last');
		this.setState({selectedRow:undefined});
	}
	sortByRoleClickHandler(){
		this.fetchUserData('role');
		this.setState({selectedRow:undefined});
	}

	handleDeleteUserButton(uid){
		fetch(API_PATH + '/user/byuid?uid=' + uid, {
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
			let curTable = this.state.userTable;
			curTable.splice(this.state.selectedRow, 1);
			this.setState({userTable:curTable, selectedRow:undefined});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render() {
		return (
			<div style={{marginTop: '25px'}}>
				<div>
					<Nav style={{float: 'left'}}>
						<NavDropdown title="Sort By">
							<NavDropdown.Item onClick={this.sortByOnidClickHandler}>ONID</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByBusinessNameClickHandler}>Company Name</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByFirstNameClickHandler}>First Name</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByLastNameClickHandler}>Last Name</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByRoleClickHandler}>Role</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<AddStudentDialogButton style={{float:'right', margin: '5px'}}/>
					<ImportStudentButton style={{float:'right', margin: '5px'}}/>
				</div>
				<Table responsive="sm"
					size="xl"
					style={{paddingBottom:'40px' , paddingTop: '10px'}}
					bordered hover variant="dark">
					<thead>
						<tr key="head">
							<th>Onid</th>
							<th>Company</th>
							<th>First Name </th>
							<th>Last Name</th>
							<th>Section</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{this.state.userTable.map((student, index) => {
							const {name,bid,uid,first,last,section,role} = student;
							let roleType = '';
							if (role === 0){
								roleType = 'Student';
							}
							else if (role === 1){
								roleType = 'Instructor';
							}
							else if (role === 2){
								roleType = 'Admin';
							}

							if (index === this.state.selectedRow){
								return (
									<React.Fragment key={uid}>
										<tr key={uid}
											onClick={() => this.handleRowClick(index)}
											style={{cursor: 'pointer', border: '2px solid white', borderTop: '3px solid white', borderBottom: '0px solid'}}>
											<td>{uid}</td>
											<td>({bid}) {name}</td>
											<td>{first}</td>
											<td>{last}</td>
											<td>{section}</td>
											<td>{roleType}</td>
										</tr>
										<tr key={uid+1} style={{color:'white', border: '2px solid', borderTop: '0px'}}>
											<td colSpan="6">
												<Button style={{float:'right', margin: '8px'}} onClick={() => this.handleDeleteUserButton(uid)}>Delete</Button>
												<Button style={{float:'right', margin: '8px'}}>Change Company</Button>
											</td>
										</tr>
									</React.Fragment>
								);
							}
							else{
								return (
									<tr key={uid} onClick={() => this.handleRowClick(index)} style={{cursor: 'pointer'}}>
										<td>{uid}</td>
										<td>({bid}) {name}</td>
										<td>{first}</td>
										<td>{last}</td>
										<td>{section}</td>
										<td>{roleType}</td>
									</tr>
								);
							}
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}
export default Tables
