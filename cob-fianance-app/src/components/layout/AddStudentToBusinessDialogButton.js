import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export class AddStudentDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			bid: props.bid
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
			bid: NaN
		});
		this.setState({modalShow: false});
	}
	handle_submit(e) {
		e.preventDefault();

		const addUserToBusinessBody = {uid:this.props.uid, bid:this.state.bid};
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
			this.props.onSave();
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
					<Button variant="primary" onClick={this.open_dialog} style={this.props.style}>Change Company</Button>
				</>
			)
		else {
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog} style={this.props.style}>Change Company</Button>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title>
								Add/Move Student to Company
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handle_submit}>
								<Form.Group>
									<Form.Label>ONID: {this.props.uid}</Form.Label><br/>

									<Form.Label>Business ID:</Form.Label>
									<Form.Control type="number" value={this.state.bid} onChange={(e) => this.setState({bid: e.target.value})} />
								</Form.Group>

								<Button variant="primary" type="submit">Add/Move</Button>
							</Form>
						</Modal.Body>
					</Modal>
				</>
			)
		}
	}
}
export default AddStudentDialogButton
