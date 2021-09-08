import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';
export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			uid: "",
			token: null
		};

		this.getUserToken = this.getUserToken.bind(this);
		this.handleUidChange = this.handleUidChange.bind(this);
	}

	componentDidMount(){
		if (window.localStorage.getItem('jwt') !== undefined ) {
			if (parseInt(window.localStorage.getItem('role')) === 0) {
				this.props.history.push('/student/dashboard');
			} else if (parseInt(window.localStorage.getItem('role') === 1) || parseInt(window.localStorage.getItem('role')) === 2) {
				this.props.history.push('/instructor/dashboard');
			} else {
				window.localStorage.removeItem('jwt');
				window.localStorage.removeItem('role');
				window.localStorage.removeItem('user_id');
			}
		}
	}

	handleUidChange(e) {
		this.setState({uid: e.target.value});
	}

	getUserToken() {
		if (this.state.token !== 0 && this.state.token !== null){
			alert("User already has a Token!");
		} else {
			fetch(API_PATH + '/auth?uid=' + this.state.uid, {
				mode: 'cors',
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				}
			}).then(response => {
				return response.json();
			}).then(data => {
				if (data.token){
					this.setState({token: data.token});
					if (data.role >= 1){
						this.setState({role: data.role});
						window.localStorage.setItem('jwt',"Bearer " + data.token);
						window.localStorage.setItem('role', data.role);
						window.localStorage.setItem('user_id', data.user_id);
						this.props.history.push('/instructor/dashboard');
					} else if (data.role === 0){
						this.setState({role: data.role});
						window.localStorage.setItem('jwt',"Bearer " + data.token);
						window.localStorage.setItem('role', data.role);
						window.localStorage.setItem('user_id', data.user_id);
						this.props.history.push('/student/dashboard');
					} else {
						alert("No role specified!");
						this.setState({token: 0});
					}
				//redirect to instructor or student account
				} else {
					this.setState({token: 0});
					alert(data.error);
				}
				console.log('Success:', data);
			}).catch((error) => {
				console.error('Error:', error);
			});
		}
	}

	render () {
		return (
			<div className="container">
				<React.Fragment >
					<Form>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>User ID</Form.Label>
							<Form.Control type="input" placeholder="Enter UID" onChange={this.handleUidChange} />
						</Form.Group>
						<Button onClick={this.getUserToken} variant="primary">Login</Button>
					</Form>
				</React.Fragment>
			</div>
		);
	}

}
