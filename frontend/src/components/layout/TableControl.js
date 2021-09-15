import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './styles/TableControl.css';

/*
Props

<(add) (edit) (delete)
(addDisabled) (editDisabled) (deleteDisabled)
(addOnClick) (editOnClick) (deleteOnClick)/>

*/

export default class TableControl extends Component {
	constructor(props){
		super(props);
		this.state = {
			showWarning: false
		}
		this.deleteOnClick = this.deleteOnClick.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
	}

	deleteOnClick(){
		this.setState({showWarning: true});
	}

	onConfirm(response){
		if (response === 'yes'){
			this.setState({showWarning: false});
				this.props.deleteOnClick();
		}
		else {
			this.setState({showWarning: false});
		}
	}

	render(){
		return(
			<>
				<div className='flex-container control-container'>
					{this.props.add && <Button className='addButton' disabled={this.props.addDisabled} variant='success' onClick={this.props.addOnClick}>Add</Button>}
					{this.props.edit && <Button className='editButton' disabled={this.props.editDisabled} variant='warning' onClick={this.props.editOnClick}>Edit</Button>}
					{this.props.delete && <Button className='deleteButton' disabled={this.props.deleteDisabled} variant='danger' onClick={this.deleteOnClick}>Delete</Button>}
				</div>
				<Modal show={this.state.showWarning}>
					<Modal.Body>
						<h3>Are you sure you want to delete this item?</h3>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={()=>this.onConfirm('')} variant="secondary">Cancel</Button>
						<Button onClick={()=>this.onConfirm('yes')} variant="primary">Delete</Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}
