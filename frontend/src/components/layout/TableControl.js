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
				<div className='control-container'>
					{this.props.add && <button className='control-button add-button' disabled={this.props.addDisabled} onClick={this.props.addOnClick} alt='add'/>}
					{this.props.edit && <button className='control-button edit-button' disabled={this.props.editDisabled} onClick={this.props.editOnClick} alt='edit'/>}
					{this.props.delete && <button className='control-button delete-button' disabled={this.props.deleteDisabled} onClick={this.deleteOnClick} alt='delete'/>}
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
