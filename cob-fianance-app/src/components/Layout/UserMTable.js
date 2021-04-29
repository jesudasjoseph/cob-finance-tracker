import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
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
	}
	sortByBusinessNameClickHandler(){
		this.fetchUserData('businessname');
	}
	sortByFirstNameClickHandler(){
		this.fetchUserData('first');
	}
	sortByLastNameClickHandler(){
		this.fetchUserData('last');
	}
	sortByRoleClickHandler(){
		this.fetchUserData('role');
	}

	handleDeleteUserButton(){
		fetch(API_PATH + '/user/byuid?uid=' + this.state.userTable[this.state.selectedRow].uid, {
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
			<div>
				<div style={{display: 'flex', flexDirection: 'row'}}>
					<Nav>
						<NavDropdown title="Filter By">
							<NavDropdown.Item onClick={this.sortByOnidClickHandler}>ONID</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByBusinessNameClickHandler}>Company Name</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByFirstNameClickHandler}>First Name</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByLastNameClickHandler}>Last Name</NavDropdown.Item>
							<NavDropdown.Item onClick={this.sortByRoleClickHandler}>Role</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Button onClick={this.handleDeleteUserButton} disabled={!(this.state.selectedRow+1)}>Delete User</Button>
				</div>
				<Table responsive="sm"
					size="xl"
					style={{paddingBottom:'40px' , paddingTop: '10px'}}
					striped bordered hover variant="dark">
					<thead>
						<tr>
							<th>Onid</th>
							<th>Group Name</th>
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
									<tr
										key={uid}
										onClick={() => this.handleRowClick(index)}
										style={{cursor: 'pointer', color:'grey', outlineStyle:'solid', outlineWidth:'2px', outlineColor:'black'}}>
										<td>{uid}</td>
										<td>({bid}) {name}</td>
										<td>{first}</td>
										<td>{last}</td>
										<td>{section}</td>
										<td>{roleType}</td>
									</tr>
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
