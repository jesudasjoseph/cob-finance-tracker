import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

/*
Props:
handleClose()
handleSubmit(businessObject)
show
*/

export default class AddCompanyDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			section: '',
			instructor: 'default'
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
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
		this.props.handleClose();
	}
	handle_submit(e) {
		e.preventDefault();

		if (this.state.section === ''){
			this.setState({section: 'no_section'});
		}
		this.props.handleSubmit({name:this.state.name, section:this.state.section, instructor:this.state.instructor});
		this.setState({
			name: '',
			section: '',
			instructor: ''
		});
	}

	render() {
		return (
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Add Company
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group>
								<Form.Label>Name</Form.Label>
								<Form.Control type="text" value={this.state.name}  onChange={(e) => this.setState({name: e.target.value})} />

								<Form.Label>Section</Form.Label>
								<Form.Control type="text" value={this.state.section} onChange={(e) => this.setState({section: e.target.value})} />

								<Form.Label>Instructor</Form.Label>
								<Form.Control type="text" value={this.state.instructor} onChange={(e) => this.setState({instructor: e.target.value})} />
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.handle_submit}>Add Company</Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}