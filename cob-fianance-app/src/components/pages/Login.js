import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: "",
            token: ""
        };

        this.getUserToken = this.getUserToken.bind(this);
        this.handleUidChange = this.handleUidChange.bind(this);
    }

    handleUidChange(e) {
        this.setState({uid: e.target.value});
    }

    getUserToken() {
        if (this.state.token != null){
            let body = {uid:this.state.uid};

    		fetch('http://71.193.191.23:2021/auth', {
    			mode: 'cors',
    			method: 'POST',
    			credentials: 'same-origin',
    			headers: {
    				'Accept': 'application/json',
    				'Content-type': 'application/json'
    			},
    			body: JSON.stringify(body)
            }).then(response => {
    			return response.json();
    		}).then(data => {
    			if (data.token){
    				this.setState({token: data.token});
    			} else {
    				this.setState({token: 0});
    			}
    			console.log('Success:', data);
    		}).catch((error) => {
    			console.error('Error:', error);
    		});
        }
        else {
            alert("User already has a Token!");
        }

    }

    render () {
        return (
            <React.Fragment >
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="input" placeholder="Enter UID" onChange={this.handleUidChange} />
                    </Form.Group>
                    <Button onClick={this.getUserToken} variant="primary">
                        Student
                    </Button>
                </Form>
            </React.Fragment>
        );
    }

}
