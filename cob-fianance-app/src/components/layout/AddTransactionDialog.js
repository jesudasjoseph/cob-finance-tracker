import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

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

		this.getCurrentDate = this.getCurrentDate.bind(this);

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	getCurrentDate(){
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		let day = date.getDate();
		return `${year}-${(month < 10 ? '0' : '') + month}-${(day < 10 ? '0' : '') + day}`;
	}

	componentDidMount(){
		this.setState({date:this.getCurrentDate()});
	}

	close_dialog() {
		this.setState({
			customer: '',
			date:this.getCurrentDate(),
			product: '',
			payment_method: 'cash',
			quantity: '',
			price_per_unit:''
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
			customer: '',
			date:this.getCurrentDate(),
			product: '',
			payment_method: 'cash',
			quantity: '',
			price_per_unit:''
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
					<Form onSubmit={this.handle_submit}>
						<Modal.Body>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Date</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl type="date" value={this.state.date} onChange={(e) => this.setState({date: e.target.value})}/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Product</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required type='text' value={this.state.product} onChange={(e) => this.setState({product: e.target.value})}/>
								<FormControl.Feedback type='invalid'>Looks Good!</FormControl.Feedback>
								<FormControl.Feedback>Looks Good!</FormControl.Feedback>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Customer Name</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.customer} onChange={(e) => this.setState({customer: e.target.value})}/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>Payment Method</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl as="select" value={this.state.payment_method} onChange={(e) => this.setState({payment_method: e.target.value})}>
									<option value="cash">Cash</option>
									<option value="square">Square</option>
								</FormControl>
							</InputGroup>

							<label>Price/Unit</label>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>$</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.price_per_unit} onChange={(e) => this.setState({price_per_unit: e.target.value})}/>
							</InputGroup>

							<label>Quantity</label>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text>#</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl required value={this.state.quantity} onChange={(e) => this.setState({quantity: e.target.value})}/>
							</InputGroup>

						</Modal.Body>
						<Modal.Footer>
							<Button type='submit' variant="primary">Add</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		)
	}
}
