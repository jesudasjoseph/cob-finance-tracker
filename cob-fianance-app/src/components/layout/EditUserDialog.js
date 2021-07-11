import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class EditUserDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			bid: -1
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	static getDerivedStateFromProps(props, state){
		if (state.bid === -1)
			return {bid: props.bid};
		else
			return null;
	}

	close_dialog() {
		this.setState({
			bid: -1
		});

		this.props.handleClose();
	}
	handle_submit(e) {
		e.preventDefault();
		this.props.handleSubmit({uid:this.props.uid, bid:this.state.bid})
		this.close_dialog();
	}

	render() {
		return (
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Add/Move '{this.props.uid}' to Company
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handle_submit}>
							<Form.Group>
								<Form.Label>ONID: {this.props.uid}</Form.Label><br/>

								<Form.Label>Company ID:</Form.Label>
								<Form.Control type="number" value={this.state.bid} onChange={(e) => this.setState({bid: e.target.value})} />
							</Form.Group>

							<Button variant="primary" type="submit">Add/Move</Button>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		)
	}
}
