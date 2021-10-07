import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import { AppContext } from '../../AppContext';

/*
Props:
onClose()
onSuccess()
show
*/

export default class AddUserDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			company_id: '',
			first_name: '',
			last_name: '',
			user_id: '',
			section: '',
			role: '0',
			comapanyNameList: []
		};

		this.fetchCompanyNames = this.fetchCompanyNames.bind(this);

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
		this.fetchCompanyNames();
	}

	fetchCompanyNames(){
		let URL = process.env.REACT_APP_API_PATH + '/business/names'

		fetch(URL, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			if (Math.floor(response.status / 200) === 1){
				return response.json();
			}
			else {
				console.log(response);
				return [];
			}
		}).then((data) => {
			if (data.length){
				this.setState({comapanyNameList:data, company_id:data[0].company_id});
			}
			else {
				this.setState({comapanyNameList:[], company_id:''});
			}
		}).catch((error) => {
			console.log(error);
		});
	}

	close_dialog() {
		this.setState({
			company_id: '',
			first_name: '',
			last_name: '',
			user_id: '',
			section: '',
			role: 0
		});
		this.props.onClose();
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

	handle_submit(e) {
		e.preventDefault();

		const userBody = {user: {company_id: this.state.company_id, first_name: this.state.first_name, last_name: this.state.last_name, user_id: this.removeSpaces(this.state.user_id), section: this.state.section, role: this.state.role}};
		const addUserToBusinessBody = {user_id: this.state.user_id, company_id: this.state.company_id};
		fetch(process.env.REACT_APP_API_PATH + '/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(userBody)
		}).then(response => {
			if (Math.floor(response.status / 200) === 1){
				this.context.pushNotification('success', 'Added', 'Successfully added new user', 4);
				if (this.state.company_id !== '') {
					fetch(process.env.REACT_APP_API_PATH + '/user/addtobusiness', {
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
						if (Math.floor(response.status / 200) === 1){
							this.context.pushNotification('success', 'Added', 'Successfully added user to company', 4);
						}
						else{
							this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
						}
						this.props.onSuccess();
					}).catch((error) => {
						this.context.pushNotification('fail', 'App Error', error.toString(), 0);
					});
				}
				else {
					this.context.pushNotification('error', 'Input Error', "No company selected!", 8);
				}
			}
			else {
				this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
				this.props.onSuccess();
			}
		}).catch((error) => {
			this.context.pushNotification('error', 'App Error', error.toString(), 8);
		});

		this.setState({
			company_id: '',
			first_name: '',
			last_name: '',
			user_id: '',
			section: '',
			role: 0
		});
		this.props.onClose();
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
					<Form onSubmit={this.handle_submit}>
						<Modal.Body>

							<label>User ID</label>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>ONID</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.user_id}  onChange={(e) => this.setState({user_id: e.target.value})} />
							</InputGroup>

							<label>Name</label>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>First</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.first_name} onChange={(e) => this.setState({first_name: e.target.value})} />
							</InputGroup>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Last</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.last_name} onChange={(e) => this.setState({last_name: e.target.value})} />
							</InputGroup>

							<label>Other Info</label>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Section</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={this.state.section} onChange={(e) => this.setState({section: e.target.value})} />
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Company</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl as="select" type="text" value={this.state.company_id} onChange={(e) => this.setState({company_id: e.target.value})}>
									{
										this.state.comapanyNameList.map((company, index) => {
											return(
												<option key={company.company_id} value={company.company_id}>{company.company_id}</option>
											);
										})
									}
								</FormControl>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Role</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl as="select" type="text" value={this.state.role} onChange={(e) => this.setState({role: e.target.value})}>
									<option value="0">Student</option>
									<option value="1">Instructor</option>
									<option value="2">Admin</option>
								</FormControl>
							</InputGroup>

						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" type="submit">Add User</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		)
	}
}
AddUserDialog.contextType = AppContext;
