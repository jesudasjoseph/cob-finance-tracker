import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './styles/DatabaseManagementPage.css';

export default class DatabaseManagementPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			showWarning: false
		}

		this.resetOnClick = this.resetOnClick.bind(this);
	}

	//Reset Database
	resetOnClick(){

		this.setState({showWarning: false});
	}

	render(){
		return(
			<>
				<div className='database-management-page-container'>
					<div className='flex-container'>
						<h3>Manage Database</h3>
					</div>
					<div className='flex-container button-container'>
						<Button disabled className='left'>Export Database</Button>
						<Button disabled className='middle'>Import Database</Button>
						<Button disabled className='right' variant='danger' onClick={() => {this.setState({showWarning: true})}}>Reset Database</Button>
					</div>
				</div>
				<Modal show={this.state.showWarning}>
					<Modal.Body>
						<p>Are you sure you want to reset the whole database? This will delete all data that currently exists in the database.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={()=>{this.setState({showWarning: false})}} variant="secondary">Cancel</Button>
						<Button onClick={this.resetOnClick} variant="primary">Reset</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}
