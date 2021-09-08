import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import { API_PATH } from '../Config';
import { AppContext } from '../../AppContext';

/*
Props:
onClose()
onSuccess()
show
*/

export default class AddCompanyDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			company_id: '',
			section: '',
			instructor: '',
			instructorList: []
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
		this.setState({instructor: window.localStorage.getItem('user_id')});
		fetch(API_PATH + '/user/instructors', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
		}).then(response => {
			return response.json();
		}).then(data => {
			this.setState({instructorList:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	close_dialog() {
		this.setState({
			company_id: '',
			section: ''
		});
		this.props.onClose();
	}
	handle_submit(e) {
		e.preventDefault();

		if (this.state.section === ''){
			this.setState({section: 'no_section'});
		}

		const businessBody = {business:{company_id:this.state.company_id, section:this.state.section, instructor:this.state.instructor}}
		fetch(API_PATH + '/business', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(businessBody)
		}).then(response => {
			if (Math.floor(response.status / 200) === 1){
				this.props.onSuccess();
				this.context.pushNotification('success', 'Company Added', 'Successfuly added company!', 4);
			}
			else{
				this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
			}
		}).catch((error) => {
			this.context.pushNotification('error', 'App Error', error.toString(), 8);
		});

		this.setState({
			company_id: '',
			section: ''
		});
		this.props.onClose();
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
					<Form onSubmit={this.handle_submit}>
						<Modal.Body>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Name</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.company_id}  onChange={(e) => this.setState({company_id: e.target.value})}/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Section</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={this.state.section} onChange={(e) => this.setState({section: e.target.value})}/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Instructor</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl as="select" type="text" value={this.state.instructor} onChange={(e) => this.setState({instructor: e.target.value})}>
									{
										this.state.instructorList.map((instructor, index) => {
											return(
												<option key={instructor.user_id} value={instructor.user_id}>{instructor.first_name + ' ' + instructor.last_name}</option>
											);
										})
									}
								</FormControl>
							</InputGroup>

						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" type="submit">Add Company</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		)
	}
}
AddCompanyDialog.contextType = AppContext;
