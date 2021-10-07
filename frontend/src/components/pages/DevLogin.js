import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './styles/DevLogin.css';

export default class DevLogin extends Component {

	constructor(props) {
		super(props);
		this.state = {
			password: "",
			token: null
		};

		this.getUserToken = this.getUserToken.bind(this);
	}

	componentDidMount(){
		//Removes and user data
		window.localStorage.removeItem('jwt');
		window.localStorage.removeItem('role');
		window.localStorage.removeItem('user_id');
	}

	getUserToken(e) {
		e.preventDefault();
		fetch(process.env.REACT_APP_API_PATH + '/dev/auth?password=' + this.state.password, {
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
				}
			} else {
				alert(data.error);
				this.setState({password: ''});
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render () {
		return (
			<div className="login-container">
				<React.Fragment>
					<div>
						<h3>Developer Login</h3>
						<Form onSubmit={this.getUserToken}>
							<Form.Control className="mb-3" type="password" placeholder="Password..." onChange={(e) => this.setState({password: e.target.value})} />
							<Button className="float-right" type="submit" variant="primary">Login</Button>
						</Form>
					</div>
				</React.Fragment>
			</div>
		);
	}
}