import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class AddStudentDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {modalShow: false};

		this.open_dialog = this.open_dialog.bind(this);
		this.close_dialog = this.close_dialog.bind(this);
	}

	open_dialog() {
		this.setState({modalShow: true});
	}
	close_dialog() {
		this.setState({modalShow: false});
	}

	render() {
		if (this.state.modalShow === false)
			return (
				<>
					<Button as="input"  type="button" value="Add Student" onClick={this.open_dialog}/>
				</>
			)
		else {
			return (
				<>
					<Button as="input"  type="button" value="Add Student" onClick={this.open_dialog}/>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title id="example-custom-modal-styling-title">
								Custom Modal Styling
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form onSubmit={this.handleSubmit}>
								<label>
										Customer:
										<input type="text" value={this.state.customer}  onChange={(e) => this.setState({customer: e.target.value})} />
								</label>
								<label>
										Date:
										<input type="text" value={this.state.date} onChange={(e) => this.setState({date: e.target.value})} />
								</label>
								<label>
										product:
										<input type="text" value={this.state.product} onChange={(e) => this.setState({product: e.target.value})} />

								</label>
								<label>
										Payment Method:
										<input type="text" value={this.state.payment_method} onChange={(e) => this.setState({payment_method: e.target.value})} />

								</label>
								<label>
										Quantity:
										<input type="text" value={this.state.quantity} onChange={(e) => this.setState({quantity: e.target.value})} />

								</label>
								<label>
										Price per unit:
										<input type="text" value={this.state.price_per_unit} onChange={(e) => this.setState({price_per_unit: e.target.value})} />

								</label>
								<input type="primary" value="Submit" />
							</form>
						</Modal.Body>
					</Modal>
				</>
			)
		}
	}
}
export default AddStudentDialogButton
