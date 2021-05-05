import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export class AddDepositDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			val: '',
			description: '',
			uid: '',
			userList: []
		};

		this.open_dialog = this.open_dialog.bind(this);
		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
		this.fetchUsers = this.fetchUsers.bind(this);
	}

	componentDidMount(){
		this.fetchUsers(this.props.bid);
	}

	componentDidUpdate(prevProps){
		if (this.props.bid !== prevProps.bid){
			this.fetchUsers(this.props.bid);
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
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	open_dialog() {
		this.setState({modalShow: true});
	}
	close_dialog() {
		this.setState({
			val: '',
			description: '',
			uid: ''
		});
		this.setState({modalShow: false});
	}
	handle_submit(e) {
		e.preventDefault();

		const depositBody = {deposit:{bid:this.props.bid, val:this.state.val, description:this.state.description, uid:this.state.uid}}
		console.log(depositBody);
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
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.close_dialog();
	}

	render() {
		if (this.state.modalShow === false)
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog}>Add Deposit</Button>
				</>
			)
		else {
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog}>Add Deposit</Button>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title>
								Add Deposit
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handle_submit}>
								<Form.Group>
									<Form.Label>Amount</Form.Label>
									<Form.Control type="number" value={this.state.val}  onChange={(e) => this.setState({val: e.target.value})} />

									<Form.Label>Student ONID</Form.Label>
									<Form.Control as="select" value={this.state.uid} onChange={(e) => this.setState({uid: e.target.value})}>
										{this.state.userList.map((user, index) => {
											return(
												<React.Fragment key={user.uid}>
													<option>{user.uid}</option>
												</React.Fragment>
											);
										})}
									</Form.Control>

									<Form.Label>Description</Form.Label>
									<Form.Control type="text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})} />
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
export default AddDepositDialogButton
