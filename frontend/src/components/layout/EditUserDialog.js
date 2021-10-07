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

export default class EditUserDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			company_id: '',
			comapanyNameList: []
		};

		this.fetchCompanyNames = this.fetchCompanyNames.bind(this);

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
		this.setState({company_id: this.props.company_id});
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
				return [];
			}
		}).then((data) => {
			if (data.length){
				this.setState({comapanyNameList: data, company_id: data[0].company_id});
			}
			else {
				this.setState({comapanyNameList: [], company_id: ''});
			}
		}).catch((error) => {
			console.log(error);
		});
	}

	close_dialog() {
		this.props.onClose();
	}
	handle_submit(e) {
		e.preventDefault();

		if (this.state.company_id !== ''){
			const dataObject = {user_id:this.props.user_id, company_id:this.state.company_id};
			fetch(process.env.REACT_APP_API_PATH + '/user/addtobusiness', {
				mode: 'cors',
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json',
					'Authorization': window.localStorage.getItem('jwt')
				},
				body: JSON.stringify(dataObject)
			}).then(response => {
				if (Math.floor(response.status / 200) === 1){
					this.context.pushNotification('success', 'User Modified', 'Successfully modified user.', 4);
					this.props.onSuccess();
				}
				else {
					this.context.pushNotification('error', 'Network Error', response.status + ': ' + response.statusText, 8);
				}
			}).catch((error) => {
				console.error('error:', error);
			});
		}
		else {
			this.context.pushNotification('error', 'Input Error', "No company selected!", 8);
		}

		this.props.onClose();
	}

	render() {
		return (
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Add/Move '{this.props.user_id}' to Company
						</Modal.Title>
					</Modal.Header>
					<Form onSubmit={this.handle_submit}>
						<Modal.Body>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>ONID</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl readOnly value={this.props.user_id} />
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

						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" type="submit">Save Changes</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		)
	}
}
EditUserDialog.contextType = AppContext;
