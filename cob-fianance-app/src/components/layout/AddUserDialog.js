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
		let URL = API_PATH + '/business/names'

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
			console.log(data);
			this.setState({comapanyNameList:data, company_id:data[0].company_id});
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
		console.log(this.state.company_id);
		this.props.handleSubmit({company_id: this.state.company_id, first_name: this.state.first_name, last_name: this.state.last_name, user_id: this.removeSpaces(this.state.user_id), section: this.state.section, role: this.state.role});
		this.setState({
			company_id: '',
			first_name: '',
			last_name: '',
			user_id: '',
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
								<Form.Control type="text" value={this.state.user_id}  onChange={(e) => this.setState({user_id: e.target.value})} />

								<Form.Label>First name:</Form.Label>
								<Form.Control type="text" value={this.state.first_name} onChange={(e) => this.setState({first_name: e.target.value})} />

								<Form.Label>Last name:</Form.Label>
								<Form.Control type="text" value={this.state.last_name} onChange={(e) => this.setState({last_name: e.target.value})} />

								<Form.Label>Section:</Form.Label>
								<Form.Control type="text" value={this.state.section} onChange={(e) => this.setState({section: e.target.value})} />

								<Form.Label>Company:</Form.Label>
								<Form.Control as="select" type="text" value={this.state.company_id} onChange={(e) => this.setState({company_id: e.target.value})}>
									{
										this.state.comapanyNameList.map((company, index) => {
											return(
												<>
													<option key={company.company_id} value={company.company_id}>{company.company_id}</option>
												</>
											);
										})
									}
								</Form.Control>

								<Form.Label>Role:</Form.Label>
								<Form.Control as="select" type="text" value={this.state.role} onChange={(e) => this.setState({role: e.target.value})}>
									<option value="0">Student</option>
									<option value="1">Instructor</option>
									<option value="2">Admin</option>
								</Form.Control>
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
