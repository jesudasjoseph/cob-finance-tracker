import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {API_PATH} from '../../../Config';

const importUtil = require('../utils/importFunctions');

export default class ImportDatabaseDialog extends Component{
	constructor(props){
		super(props);
		this.state = {
			file: ''
		}

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
	}

	close_dialog(){
		this.props.handleClose();
	}
	handle_submit(){
		const fileReader = new FileReader();
		fileReader.onload = (evt) => {
			let databaseObject = null;
			try{
				databaseObject = JSON.parse(evt.target.result);
				importUtil.startImport(databaseObject, this.props.updateProgress);
			}
			catch(e){
				console.log(e);
			}
		};
		fileReader.readAsText(this.state.file);
		this.props.handleClose();
	}

	render(){
		return(
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Import Database
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.File
							accept=".ftbac"
							onChange={(e) => this.setState({file: e.target.files[0]})}
						/>
						<Modal.Footer>
						<Button variant="primary" onClick={this.handle_submit}>Import</Button>
						</Modal.Footer>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
