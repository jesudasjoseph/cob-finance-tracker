import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/*
Props:
handleClose()
handleSubmit(userObject)
show
*/

export default class AddTransactionDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			customer: '',
			date:'',
			product: '',
			payment_method: 'cash',
			quantity: '',
			price_per_unit:''
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	close_dialog() {
		this.setState({
			transaction: {
				customer: '',
				date:'',
				product: '',
				payment_method: 'cash',
				quantity: '',
				price_per_unit:''
			}
		});
		this.props.handleClose();
	}
	handle_submit(e) {
		e.preventDefault();

		this.props.handleSubmit({customer:this.state.customer,
		date:this.state.date,
		product:this.state.product ,
		payment_method:this.state.payment_method,
		quantity:this.state.quantity,
		price_per_unit:this.state.price_per_unit});

		this.setState({
			transaction: {
				customer: '',
				date:'',
				product: '',
				payment_method: 'cash',
				quantity: '',
				price_per_unit:''
			}
		});
	}

	render() {
		return (
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Add Transaction
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handle_submit}>
							<Form.Group>
								<Form.Label>Customer</Form.Label>
								<Form.Control type="text" value={this.state.customer}  onChange={(e) => this.setState({customer: e.target.value})}/>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" value={this.state.date}  onChange={(e) => this.setState({date: e.target.value})}/>
								<Form.Label>Product</Form.Label>
								<Form.Control type="text" value={this.state.product}  onChange={(e) => this.setState({product: e.target.value})}/>
								<Form.Label>Payment Method</Form.Label>
								<Form.Control as="select" value={this.state.payment_method} onChange={(e) => this.setState({payment_method: e.target.value})}>
									<option value="cash">Cash</option>
									<option value="square">Square</option>
								</Form.Control>
								<Form.Label>Quantity</Form.Label>
								<Form.Control type="text" value={this.state.quantity}  onChange={(e) => this.setState({quantity: e.target.value})}/>
								<Form.Label>Price Per Unit</Form.Label>
								<Form.Control type="text" value={this.state.price_per_unit}  onChange={(e) => this.setState({price_per_unit: e.target.value})}/>
							</Form.Group>
							<Button variant="primary" type="submit">Add</Button>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		)
	}
}
