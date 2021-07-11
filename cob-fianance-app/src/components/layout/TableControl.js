import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';

import '../styles/TableControl.css';

/*
Props

<(add) (edit) (delete)
(addDisabled) (editDisabled) (deleteDisabled)
(addOnClick) (editOnClick) (deleteOnClick)/>

*/

export default class TableControl extends Component {
	render(){
		return(
			<>
				<div>
					<div className='flex-container control-container'>
						{this.props.add && <Button className='addButton' disabled={this.props.addDisabled} variant='success' onClick={this.props.addOnClick}>Add</Button>}
						{this.props.edit && <Button className='editButton' disabled={this.props.editDisabled} variant='warning' onClick={this.props.editOnClick}>Edit</Button>}
						{this.props.delete && <Button className='deleteButton' disabled={this.props.deleteDisabled} variant='danger' onClick={this.props.deleteOnClick}>Delete</Button>}
					</div>
				</div>
			</>
		)
	}
}
