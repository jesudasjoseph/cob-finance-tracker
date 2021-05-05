import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

export class AddStudentDialogButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalShow: false,
			bid: '',
			firstName: '',
			lastName: '',
			onidId: '',
			section: '',
			role: '0'
		};

		this.open_dialog = this.open_dialog.bind(this);
		this.close_dialog = this.close_dialog.bind(this);
		this.adduser = this.adduser.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.processData = this.processData.bind(this);

	}

	open_dialog() {
		this.setState({modalShow: true});
	}
	close_dialog() {
		this.setState({
			bid: 0,
			firstName: '',
			lastName: '',
			onidId: '',
			section: '',
			role: 0
		});
		this.setState({modalShow: false});
	}

	adduser() {
		const user_body = {user:{uid:this.state.onidId, first:this.state.firstName, last: this.state.lastName, role:this.state.role, section: this.state.section}}
		const addUserToBusinessBody = {uid:this.state.onidId, bid:this.state.bid};
		fetch(API_PATH + '/user', {
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
			fetch(API_PATH + '/user/addtobusiness', {
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

		this.close_dialog();
	}


  processData(dataString) {
      const dataStringLines = dataString.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      var idx = 0;
      const list = [];
      for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length == headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] == '"')
                d = d.substring(1, d.length - 1);
              if (d[d.length - 1] == '"')
                d = d.substring(d.length - 2, 1);

              if(idx == 0){
                this.setState({onidId: d});
                idx++;
              }
              else if(idx == 1){
                this.setState({firstName: d});
                idx++;
              }
              else if(idx == 2){
                this.setState({lastName: d});
                idx++;
              }
              else if(idx == 3){
                this.setState({section: d});
                idx++;
              }
              else if(idx == 4){
                var b = parseInt(d);
                this.setState({bid: b});
                idx = 0;
                this.adduser();
              }
            }
            if (headers[j]) {
              obj[headers[j]] = d;
            }
          }

        }
      }

    }

  handleFileUpload(e) {
    const file = e.target.files[0];
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
    reader.readAsBinaryString(file);
 }

	render() {
		if (this.state.modalShow === false)
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog} style={this.props.style}>Import Students</Button>
				</>
			)
		else {
			return (
				<>
					<Button variant="primary" onClick={this.open_dialog} style={this.props.style}>Import Students</Button>
					<Modal show={true} onHide={this.close_dialog}>
						<Modal.Header closeButton>
							<Modal.Title>
								Import Students
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handle_submit}>
								<Form.Group>
                <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={this.handleFileUpload}
                />
								</Form.Group>

								<Button variant="primary" type="submit">Import</Button>
							</Form>
						</Modal.Body>
					</Modal>
				</>
			)
		}
	}
}
export default AddStudentDialogButton
