import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { API_PATH } from '../Config';

export class Tables extends Component {
	constructor(props){
		super(props);
		this.state = {
			userTable: [],
			selectedRow: undefined
		};
		this.get_allusers = this.get_allusers.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.handleDeleteUserButton = this.handleDeleteUserButton.bind(this);
	}

	get_allusers(){
		fetch(API_PATH + '/user?start=0&end=50', {
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
			let tempState = [];
			for (let i =0; i < data.length; i++){
				tempState[i] = false;
			}
			this.setState({selectedUsers: tempState, userTable:data, totalSelectedUsers: 0});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	componentDidMount(){
		this.get_allusers();
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
				<Button onClick={this.handleDeleteUserButton} disabled={!(this.state.selectedRow+1)}>Delete User</Button>
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
