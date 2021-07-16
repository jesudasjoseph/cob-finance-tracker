import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

/*
Props:
handleClose()
handleSubmit(userObject)
show
*/

export default class AddUserDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			bid: '',
			firstName: '',
			lastName: '',
			onid: '',
			section: '',
			role: '0',
			comapanyNameList: []
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	fetchCompanyNames(){
		
	}

	close_dialog() {
		this.setState({
			bid: '',
			firstName: '',
			lastName: '',
			onid: '',
			section: '',
			role: 0
		});
		this.props.handleClose();
	}

	//Removes Spaces from input text and returns string without spaces
	removeSpaces(text) {
		if (text != null){
			text = text.trim();
			let index = text.indexOf(' ');
			while(index >= 0){
				let firstHalf = text.slice(0, index);
				let secondHalf = text.slice(index + 1, text.length);
				text = firstHalf + secondHalf;
				index = text.indexOf(' ');
			}
		}
		return text;
	}

	handle_submit() {
		this.props.handleSubmit({bid: this.state.bid, firstName: this.state.firstName, lastName: this.state.lastName, uid: this.removeSpaces(this.state.onid), section: this.state.section, role: this.state.role});
		this.setState({
			bid: '',
			firstName: '',
			lastName: '',
			onid: '',
			section: '',
			role: 0
		});
	}

	render() {
		return(
			<>
				<Modal show={this.props.show} onHide={this.close_dialog} autoFocus>
					<Modal.Header closeButton>
						<Modal.Title>
							Add User
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group>
								<Form.Label>ONID:</Form.Label>
								<Form.Control type="text" value={this.state.onid}  onChange={(e) => this.setState({onid: e.target.value})} />

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
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.handle_submit}>Add User</Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}
