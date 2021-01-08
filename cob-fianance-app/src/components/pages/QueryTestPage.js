import React from 'react'
import Button from 'react-bootstrap/Button';

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
	}

	getToken() {

		fetch('http://localhost:2700/auth', {
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
		fetch('http://localhost:2700/deposit', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Authorization': `{"token":"${token}", "user":"jess"}`
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

	render () {
	    return (
	        <React.Fragment >
	            <div style={{flex: '1', paddingTop:'5px', paddingBottom:'5px' , textAlign: 'center' }}><>
	            <Button onClick={this.getToken} style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button0Text} />{' '}</>
	            </div>
	            <div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button onClick={this.checkToken} style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button1Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button2Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button3Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button4Text} />{' '}</>
	            </div>
				<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button5Text} />{' '}</>
	            </div>

	        </React.Fragment>
	    );
	}
}
