import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { API_PATH } from '../Config';

export class StudentTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			bid: this.props.dataFromParent,
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
		fetch(API_PATH + '/user/bybid?bid=' + this.state.bid.bid, {
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
							const {first,last,uid,section} = student;
							return (
								<tr key={index}>
									<td> {first}</td>
									<td> {last} </td>
									<td> {uid} </td>
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
export default StudentTable
