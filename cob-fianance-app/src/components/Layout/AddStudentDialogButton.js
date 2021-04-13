import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class AddStudentDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			customer: '',
			date: '',
			product: '',
			payment_method: '',
			quantity: '',
			price_per_unit: ''
		};

		this.open_dialog = this.open_dialog.bind(this);
		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	open_dialog() {
		this.setState({modalShow: true});
	}
	close_dialog() {
		this.setState({
			customer: '',
			date: '',
			product: '',
			payment_method: '',
			quantity: '',
			price_per_unit: ''
		});
		this.setState({modalShow: false});
	}
	handle_submit(e) {
		e.preventDefault();

		this.close_dialog();
	}

	render() {
		if (this.state.modalShow === false)
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog}>Add Student</Button>
				</>
			)
		else {
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog}>Add Student</Button>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title>
								Add Student
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handle_submit}>
								<Form.Group>
									<Form.Label>Customer:</Form.Label>
									<Form.Control type="text" value={this.state.customer}  onChange={(e) => this.setState({customer: e.target.value})} />

									<Form.Label>Date:</Form.Label>
									<Form.Control type="text" value={this.state.date} onChange={(e) => this.setState({date: e.target.value})} />

									<Form.Label>product:</Form.Label>
									<Form.Control type="text" value={this.state.product} onChange={(e) => this.setState({product: e.target.value})} />

									<Form.Label>Payment Method:</Form.Label>
									<Form.Control type="text" value={this.state.payment_method} onChange={(e) => this.setState({payment_method: e.target.value})} />

									<Form.Label>Quantity:</Form.Label>
									<Form.Control type="text" value={this.state.quantity} onChange={(e) => this.setState({quantity: e.target.value})} />

									<Form.Label>Price per unit:</Form.Label>
									<Form.Control type="text" value={this.state.price_per_unit} onChange={(e) => this.setState({price_per_unit: e.target.value})} />
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
export default AddStudentDialogButton
