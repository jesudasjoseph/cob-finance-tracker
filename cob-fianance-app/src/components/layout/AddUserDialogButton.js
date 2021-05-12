import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export class AddUserDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			bid: '',
			firstName: '',
			lastName: '',
			onidId: '',
			section: '',
			role: '0'
		};

		this.open_dialog = this.open_dialog.bind(this);
		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	open_dialog() {
		this.setState({modalShow: true});
	}
	close_dialog() {
		this.setState({
			bid: 0,
			firstName: '',
			lastName: '',
			onidId: '',
			section: '',
			role: 0
		});
		this.setState({modalShow: false});
	}
	handle_submit(e) {
		e.preventDefault();

		const user_body = {user:{uid:this.state.onidId, first:this.state.firstName, last: this.state.lastName, role:this.state.role, section: this.state.section}}
		const addUserToBusinessBody = {uid:this.state.onidId, bid:this.state.bid};
		fetch(API_PATH + '/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(user_body)
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
			}).catch((error) => {
				console.error('Error:', error);
			});
		}).catch((error) => {
			console.error('Error:', error);
		});

		this.close_dialog();
	}

	render() {
		if (this.state.modalShow === false)
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog} style={this.props.style}>Add User</Button>
				</>
			)
		else {
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog} style={this.props.style}>Add User</Button>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title>
								Add User
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handle_submit}>
								<Form.Group>
									<Form.Label>ONID:</Form.Label>
									<Form.Control type="text" value={this.state.onidId}  onChange={(e) => this.setState({onidId: e.target.value})} />

									<Form.Label>First name:</Form.Label>
									<Form.Control type="text" value={this.state.firstName} onChange={(e) => this.setState({firstName: e.target.value})} />

									<Form.Label>Last name:</Form.Label>
									<Form.Control type="text" value={this.state.lastName} onChange={(e) => this.setState({lastName: e.target.value})} />

									<Form.Label>Section:</Form.Label>
									<Form.Control type="text" value={this.state.section} onChange={(e) => this.setState({section: e.target.value})} />

									<Form.Label>Role:</Form.Label>
									<Form.Control as="select" type="text" value={this.state.role} onChange={(e) => this.setState({role: e.target.value})}>
										<option value="0">Student</option>
										<option value="1">Instructor</option>
										<option value="2">Admin</option>
									</Form.Control>

									<Form.Label>Business ID:</Form.Label>
									<Form.Control type="number" value={this.state.bid} onChange={(e) => this.setState({bid: e.target.value})} />
								</Form.Group>

								<Button variant="primary" type="submit">Add</Button>
							</Form>
						</Modal.Body>
					</Modal>
				</>
			)
		}
	}
}
export default AddUserDialogButton
