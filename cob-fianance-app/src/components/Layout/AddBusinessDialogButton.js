import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export class AddBusinessDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			name: '',
			section: '',
			instructor: 'default'
		};

		this.open_dialog = this.open_dialog.bind(this);
		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	open_dialog() {
		this.setState({modalShow: true});
		fetch(API_PATH + '/user/asker', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data)
			this.setState({instructor:data.uid});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	close_dialog() {
		this.setState({
			name: '',
			section: '',
			instructor: ''
		});
		this.setState({modalShow: false});
	}
	handle_submit(e) {
		e.preventDefault();

		if (this.state.section === ''){
			this.state.section = 'no_section';
		}
		const business_body = {business:{name:this.state.name, section:this.state.section, instructor:this.state.instructor}}
		fetch(API_PATH + '/business', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(business_body)
		}).then(response => {
			console.log(response);
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.close_dialog();
	}

	render() {
		if (this.state.modalShow === false)
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog}>Add Business</Button>
				</>
			)
		else {
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog}>Add Business</Button>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title>
								Add Business
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handle_submit}>
								<Form.Group>
									<Form.Label>Name</Form.Label>
									<Form.Control type="text" value={this.state.name}  onChange={(e) => this.setState({name: e.target.value})} />

									<Form.Label>Section</Form.Label>
									<Form.Control type="text" value={this.state.section} onChange={(e) => this.setState({section: e.target.value})} />

									<Form.Label>Instructor</Form.Label>
									<Form.Control type="text" value={this.state.instructor} onChange={(e) => this.setState({instructor: e.target.value})} />
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
export default AddBusinessDialogButton
