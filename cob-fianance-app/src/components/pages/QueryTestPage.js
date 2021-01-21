//Page for test http requests
//Temporary and should be removed from build!

import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

let token = 0;

export default class QueryTestPage extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
			button0Text: "Get Token!",
			button1Text: "Validate Token!",
			button2Text: "Text",
			button3Text: "Text",
			button4Text: "Text",
			button5Text: "Text"
		};

		this.getToken = this.getToken.bind(this);
		this.checkToken = this.checkToken.bind(this);
		this.handleUserChange = this.handleUserChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
	}

	getToken() {

		fetch('http://71.193.191.23:2021/auth', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
		}).then(response => {
			return response.json();
		}).then(data => {
			if (data.token){
				token = data.token;
				this.setState({button0Text: token});
			} else {
				this.setState({button0Text: "Failed to get Token!"});
				token = 0;
			}
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	checkToken() {
		fetch('http://71.193.191.23:2021/deposit', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Authorization': `Bearer ${token}`
			},
		})
		.then(response => {
			console.log(response);
			return response.text();
		})
		.then(data => {
			this.setState({button1Text: data});
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	handleUserChange(e){
		this.setState({user: e.target.value});
	}
	handlePasswordChange(e){
		this.setState({password: e.target.value});
	}
	handleSubmitClick(e){
		let bod = {user:this.state.user, password:this.state.password};

		fetch('http://71.193.191.23:2021/auth', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(bod)
		}).then(response => {
			return response.json();
		}).then(data => {
			if (data.token){
				token = data.token;
				this.setState({button0Text: token});
			} else {
				this.setState({button0Text: "Failed to get Token!"});
				token = 0;
			}
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render () {
	    return (
	        <React.Fragment >
			<div style={{display: 'flex', flexDirection: 'row'}}>
			<div style={{display: 'flex', flex: '1', paddingTop: '10px'}}>
			<Form style={{flex: '1'}}>
			  <Form.Group controlId="formBasicEmail">
			    <Form.Control placeholder="Enter User" onChange={this.handleUserChange} />
			  </Form.Group>

			  <Form.Group controlId="formBasicPassword">
			    <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange} />
			  </Form.Group>
			  <Button onClick={this.handleSubmitClick}>
			    Submit
			  </Button>
			</Form>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
	            <div style={{flex: '1', paddingTop:'5px', paddingBottom:'5px' , textAlign: 'center' }}><>
	            <Button onClick={this.getToken} style={{width: '300px',flex: '1' , textAlign: 'center',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button0Text} />{' '}</>
	            </div>
	            <div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button onClick={this.checkToken} style={{ width: '300px', flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button1Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{width: '300px',flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button2Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{width: '300px',flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button3Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{width: '300px',flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button4Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{width: '300px',flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button5Text} />{' '}</>
	            </div>
			</div>
			</div>
	        </React.Fragment>
	    );
	}
}
