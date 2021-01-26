import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class Login extends React.Component {

    constructor(props) {
        let myStorage = window.localStorage;
        super(props);
        this.state = {
            uid: "",
            token: null
        };

        this.getUserToken = this.getUserToken.bind(this);
        this.handleUidChange = this.handleUidChange.bind(this);

        if (myStorage.getItem('token') != undefined ) {
            if (myStorage.getItem('role') === 'student' ) {
                props.history.push('/dashboard');
            }
            else if (myStorage.getItem('role') === 'instructor') {
                props.history.push('/DashboardI');
            }
            else {
                myStorage.removeItem('token');
                myStorage.removeItem('role');
            }
        }
    }

    handleUidChange(e) {
        this.setState({uid: e.target.value});
    }

    getUserToken() {
        let myStorage = window.localStorage;
        if (this.state.token != null){
            alert("User already has a Token!");
        }
        else {
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
                    if (data.role === "instructor"){
                        this.setState({role: data.role});
                        myStorage.setItem('jwt',"Bearer " + this.state.token);
                        myStorage.setItem('role', data.role);
                        this.props.history.push('/DashboardI');
                    }
                    else if (data.role === "student"){
                        this.setState({role: data.role});
                        myStorage.setItem('jwt',"Bearer " + this.state.token);
                        myStorage.setItem('role', data.role);
                        this.props.history.push('/dashboard');
                    }
                    else {
                        alert("No role specified!");
                        this.setState({token: 0});
                    }
                    //redirect to instructor or student account
    			} else {
    				this.setState({token: 0});
                    alert("Failed to get Token!");
    			}
    			console.log('Success:', data);
    		}).catch((error) => {
    			console.error('Error:', error);
    		});
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
