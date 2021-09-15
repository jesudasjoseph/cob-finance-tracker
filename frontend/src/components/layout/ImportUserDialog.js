import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

export default class ImportUserDialog extends Component {
	constructor(props){
		super(props);
		this.state = {
			file: ''
		};

		this.close_dialog = this.close_dialog.bind(this);
		this.handle_submit = this.handle_submit.bind(this);
		this.adduser = this.adduser.bind(this);
		this.processData = this.processData.bind(this);
	}

	close_dialog() {
		this.setState({
			file: ''
		});
		this.props.handleClose();
	}

	adduser(user_id, first_name, last_name, section, company_id) {
		const user_body = {user:{user_id: user_id, first_name: first_name, last_name: last_name, role: 0, section: section}}
		const addUserToBusinessBody = {user_id: user_id, company_id:company_id};
		fetch(process.env.REACT_APP_API_PATH + '/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(user_body)
		}).then(response => {
			console.log(response);
			fetch(process.env.REACT_APP_API_PATH + '/user/addtobusiness', {
				mode: 'cors',
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json',
					'Authorization': window.localStorage.getItem('jwt')
				},
				body: JSON.stringify(addUserToBusinessBody)
			}).then(response => {
				console.log(response);
			}).catch((error) => {
				console.error('Error:', error);
			});
		}).catch((error) => {
			console.error('Error:', error);
		});
		this.props.handleSubmit();
	}

	processData(dataString) {
		let onid = '';
		let firstName = '';
		let lastName = '';
		let section = '';
		let bid = -1;

		const dataStringLines = dataString.split(/\r\n|\n/);
		const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
		var idx = 0;
		for (let i = 1; i < dataStringLines.length; i++) {
			onid = '';
			firstName = '';
			lastName = '';
			section = '';
			bid = -1;
			const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length === headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] === '"')
                d = d.substring(1, d.length - 1);
              if (d[d.length - 1] === '"')
                d = d.substring(d.length - 2, 1);

              if(idx === 0){
                onid = d;
                idx++;
              }
              else if(idx === 1){
                firstName = d;
                idx++;
              }
              else if(idx === 2){
                lastName = d;
                idx++;
              }
              else if(idx === 3){
                section = d;
                idx++;
              }
              else if(idx === 4){
                bid = parseInt(d);
                idx = 0;
                this.adduser(onid, firstName, lastName, section, bid);
              }
            }
            if (headers[j]) {
              obj[headers[j]] = d;
            }
          }

        }
      }

    }

	handle_submit(e){
		e.preventDefault();

		const reader = new FileReader();
		reader.onload = (evt) => {
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: 'binary' });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
			this.processData(data);
		};
		reader.readAsBinaryString(this.state.file);
		this.setState({file: ''});

		this.props.handleSubmit();
	}

	render() {
		return (
			<>
				<Modal show={this.props.show} onHide={this.close_dialog}>
					<Modal.Header closeButton>
						<Modal.Title>
							Import Users
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handle_submit}>
							<Form.Group>
								<Form.File
									accept=".csv,.xlsx,.xls"
									onChange={(e) => this.setState({file: e.target.files[0]})}
								/>
							</Form.Group>
							<Button variant="primary" type="submit">Import</Button>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
