import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export default class AddDepositDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			val: '',
			description: '',
			uid: '',
			userList: []
		};

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
			if (data.length === 0){
				this.setState({uid: ''});
			}
			else {
				this.setState({uid: data[0].uid});
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	close_dialog() {
		this.setState({
			val: '',
			description: '',
			uid: ''
		});
		this.props.handleClose();
	}
	handle_submit(e) {
		e.preventDefault();

		this.props.handleSubmit({bid:this.props.bid, val:this.state.val, description:this.state.description, uid:this.state.uid});
		this.setState({
			val: '',
			description: '',
			uid: ''
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
								<Form.Control type="number" value={this.state.val}  onChange={(e) => this.setState({val: e.target.value})} />

								<Form.Label>Student ONID</Form.Label>
								<Form.Control as="select" value={this.state.uid} onChange={(e) => this.setState({uid: e.target.value})}>
									{this.state.userList.map((user, index) => {
										return(
											<React.Fragment key={user.uid}>
												<option value={user.uid}>{user.uid}</option>
											</React.Fragment>
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
