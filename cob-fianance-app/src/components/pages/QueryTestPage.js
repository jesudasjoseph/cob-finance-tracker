import React from 'react'
import Button from 'react-bootstrap/Button';

export default class QueryTestPage extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {token: "meh"};
		this.postDataTest = this.postDataTest.bind(this);
		this.getDataTest = this.getDataTest.bind(this);
	}

	postDataTest() {

		fetch('http://localhost:2700/auth', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
		}).then(response => {
			return response.json();
		}).then(data => {
			this.setState({token: data.token});
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});



	}


	getDataTest() {
		//	  let tempdata = postData('http://localhost:2700', { requestType: "login", username: "username", password: "password" })
		//	  .then(data => {
		//		console.log("here");
		// 		console.log(data); // JSON data parsed by `data.json()` call
		// 	  });
		//	  console.log("here!");

		fetch('http://localhost:2700/deposit', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Authorization': '{"token":"548148593027jess::ffff:127.0.0.1", "username":"jess"}'
			},
		})
		.then(response => {
			console.log(response);
			return response.text();
		})
		.then(data => {
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
	            <Button onClick={this.postDataTest} style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '100px' }} as="input" type="button" value={this.state.token} />{' '}</>
	            </div>
	            <div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
	            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '100px' }} as="input" type="button" value="Get User Transactions" />{' '}</>
	            </div>

	        </React.Fragment>
	    );
	}
}
