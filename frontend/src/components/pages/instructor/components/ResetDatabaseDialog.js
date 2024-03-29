import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { AppContext } from '../../../../AppContext';

export default class ResetDatabaseDialog extends Component{
	constructor(props){
		super(props);
		this.state = {
			resetCode: '',
			userResetCode: ''
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
		fetch(process.env.REACT_APP_API_PATH + '/admin/reset-code', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			return response.json();
		}).then(data => {
			this.setState({resetCode: data.code});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	close_dialog(){
		this.setState({userResetCode: ''});
		this.props.handleClose();
	}
	handle_submit(){
		fetch(process.env.REACT_APP_API_PATH + '/admin/reset-database?code=' + this.state.userResetCode, {
			mode: 'cors',
			method: 'DELETE',
			credentials: 'same-origin',
			headers: {
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			if (response.status === 200){
				this.context.pushNotification('success', 'Successfully Reset Database', '', 4000);
			}
			else if (response.status === 406){
				this.context.pushNotification('fail', 'Server Error', 'Reset code does not match! Try again!', 6000);
			}
			else {
				this.context.pushNotification('fail', 'Network Error', response.status + ': ' + response.statusText, 0);
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.setState({userResetCode: ''});
		this.props.handleClose();
	}

	render(){
		return(
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Reset Database
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<p>This will delete all information in the database except for the current user information.</p>
							<Form.Label>Confirm database reset by typing out: "{this.state.resetCode}"</Form.Label>
							<Form.Control type="text" value={this.state.userResetCode}  onChange={(e) => this.setState({userResetCode: e.target.value})} />
						</Form>
						<Modal.Footer>
						<Button variant="primary" onClick={this.handle_submit}>Reset</Button>
						</Modal.Footer>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
ResetDatabaseDialog.contextType = AppContext;
