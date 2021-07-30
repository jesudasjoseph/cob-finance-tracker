import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { API_PATH } from '../Config';

export default class StudentTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			students: []
		}
		//this.fetchBusinessStudents = this.fetchBusinessStudents.bind(this);
		this.fetchBusinessStudents = this.fetchBusinessStudents.bind(this);
	}

	componentDidMount(){
		//Check to see if a bid was passed to the Component\
		this.fetchBusinessStudents();
	}
	fetchBusinessStudents(){
		fetch(API_PATH + '/user/bybid?bid=' + this.props.company_id, {
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
			this.setState({students:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	render() {
		return (
			<div>
				<Table
					responsive="sm"
					size="xl"
					style={{paddingBottom:'40px' , paddingTop: '10px'}}
					striped bordered hover variant="dark">
					<thead>
						<tr>
							<th>First</th>
							<th>Last</th>
							<th>uid</th>
							<th>Section</th>

						</tr>
					</thead>
					<tbody>
					{this.state.students.map((student, index) => {
							const {first_name,last_name,user_id,section} = student;
							return (
								<tr key={index}>
									<td> {first_name}</td>
									<td> {last_name} </td>
									<td> {user_id} </td>
									<td> {section} </td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}
