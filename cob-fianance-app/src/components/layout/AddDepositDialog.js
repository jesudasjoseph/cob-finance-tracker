import React, { Component } from 'react'
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

export default class AddDepositDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: '',
			description: '',
			user_id: '',
			userList: []
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
		this.fetchUsers = this.fetchUsers.bind(this);
	}

	componentDidMount(){
		this.fetchUsers(this.props.company_id);
	}

	componentDidUpdate(prevProps){
		if (this.props.company_id !== prevProps.company_id){
			this.fetchUsers(this.props.company_id);
		}
	}

	fetchUsers(bid){
		fetch(API_PATH + '/user/bybid?bid=' + bid, {
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
			this.setState({userList:data});
			if (data.length === 0){
				this.setState({user_id: ''});
			}
			else {
				this.setState({user_id: data[0].user_id});
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	close_dialog() {
		this.setState({
			value: '',
			description: ''
		});
		this.props.onClose();
	}
	handle_submit(e) {
		e.preventDefault();

		const depositBody = {deposit: {company_id:this.props.company_id, value:this.state.value, description:this.state.description, user_id:this.state.user_id}};
		fetch(API_PATH + '/deposit', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(depositBody)
		}).then((response) => {
			if (Math.floor(response.status / 200) === 1){
				this.context.pushNotification('success', 'Deposite Added', 'Successfully added deposit!', 4);
				this.props.onSuccess();
			}
			else{
				this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
			}
		}).catch((error) => {
			console.error('Error:', error);
			this.context.pushNotification('error', 'App Error', error.toString(), 8);
		});

		this.setState({
			value: '',
			description: ''
		});
		this.props.onClose();
	}

	render() {
		return (
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Add Deposit
						</Modal.Title>
					</Modal.Header>
					<Form onSubmit={this.handle_submit}>
						<Modal.Body>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>$</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required type="number" value={this.state.value}  onChange={(e) => this.setState({value: e.target.value})} />
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>ONID</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl as="select" value={this.state.user_id} onChange={(e) => this.setState({user_id: e.target.value})}>
									{this.state.userList.map((user, index) => {
										return(
											<option key={user.user_id} value={user.user_id}>{user.user_id}</option>
										);
									})}
								</FormControl>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Note</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={this.state.description} onChange={(e) => this.setState({description: e.target.value})} />
							</InputGroup>

						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" type="submit">Add</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		)
	}
}
AddDepositDialog.contextType = AppContext;
