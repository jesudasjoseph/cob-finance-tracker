import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class EditUserDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			company_id: ''
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
		this.setState({company_id: this.props.company_id});
	}

	close_dialog() {
		this.props.handleClose();
	}
	handle_submit(e) {
		e.preventDefault();
		this.props.handleSubmit({user_id:this.props.user_id, company_id:this.state.company_id})
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
					<Modal.Body>
						<Form onSubmit={this.handle_submit}>
							<Form.Group>
								<Form.Label>ONID: {this.props.user_id}</Form.Label><br/>

								<Form.Label>Company ID:</Form.Label>
								<Form.Control type="number" value={this.state.company_id} onChange={(e) => this.setState({company_id: e.target.value})} />
							</Form.Group>

							<Button variant="primary" type="submit">Add/Move</Button>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		)
	}
}
