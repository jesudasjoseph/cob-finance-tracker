import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { API_PATH } from '../Config';

export class Tables extends Component {
	constructor(props){
		super(props);
		this.state = {
			userTable: [],
			selectedUsers: [],
			totalSelectedUsers: 0
		};
		this.get_allusers = this.get_allusers.bind(this);
		this.handleRowCheckBoxClick = this.handleRowCheckBoxClick.bind(this);
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

	handleRowCheckBoxClick(index){
		let selectedUsersNew = this.state.selectedUsers;
		let selectCount = 0;
		switch (selectedUsersNew[index]){
			case true:
				selectCount = -1;
				selectedUsersNew[index] = false;
				break;
			case false:
				selectCount = 1;
				selectedUsersNew[index] = true;
				break;
		}
		this.setState({selectedUsers: selectedUsersNew, totalSelectedUsers: this.state.totalSelectedUsers+selectCount});
	}

	render() {
		return (
			<div>
				<Table responsive="sm"
					size="xl"
					style={{paddingBottom:'40px' , paddingTop: '10px'}}
					striped bordered hover variant="dark">
					<thead>
						<tr>
							<th></th>
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

							return (
								<tr key={uid} onClick={() => this.handleRowCheckBoxClick(index)} style={{cursor: 'pointer'}}>
									<td><Button as="input" type="checkbox" disabled readOnly checked={this.state.selectedUsers[index]}/></td>
									<td>{uid}</td>
									<td>({bid}) {name}</td>
									<td>{first}</td>
									<td>{last}</td>
									<td>{section}</td>
									<td>{roleType}</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}
export default Tables
