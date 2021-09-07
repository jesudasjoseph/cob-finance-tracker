import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

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
			description: '',
			user_id: ''
		});
		this.props.handleClose();
	}
	handle_submit(e) {
		e.preventDefault();

		this.props.handleSubmit({company_id:this.props.company_id, value:this.state.value, description:this.state.description, user_id:this.state.user_id});
		this.setState({
			value: '',
			description: '',
			user_id: ''
		});
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
					<Modal.Body>
						<Form>
							<Form.Group>
								<Form.Label>Amount</Form.Label>
								<Form.Control type="number" value={this.state.value}  onChange={(e) => this.setState({value: e.target.value})} />

								<Form.Label>Student ONID</Form.Label>
								<Form.Control as="select" value={this.state.user_id} onChange={(e) => this.setState({user_id: e.target.value})}>
									{this.state.userList.map((user, index) => {
										return(
											<option key={user.user_id} value={user.user_id}>{user.user_id}</option>
										);
									})}
								</Form.Control>

								<Form.Label>Description</Form.Label>
								<Form.Control type="text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})} />
							</Form.Group>
						</Form>
						<Modal.Footer>
							<Button variant="primary" type="submit" onClick={this.handle_submit}>Add</Button>
						</Modal.Footer>
					</Modal.Body>
				</Modal>
			</>
		)
	}
}
