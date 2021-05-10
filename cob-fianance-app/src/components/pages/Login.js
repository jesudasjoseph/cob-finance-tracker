import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';
export default class Login extends React.Component {
	render () {
		if (window.localStorage.getItem('jwt') !== undefined ) {
			if (parseInt(window.localStorage.getItem('role')) === 0) {
				this.props.history.push('/student/dashboard');
			} else if (parseInt(window.localStorage.getItem('role') === 1) || parseInt(window.localStorage.getItem('role')) === 2) {
				this.props.history.push('/instructor/dashboard');
			} else {
				window.localStorage.removeItem('jwt');
				window.localStorage.removeItem('role');
				window.location.href = '/saml/auth';
			}
		}

		return (
			<React.Fragment >
				<h2>Will redirect shortly!</h2>
				<a href="/saml/auth">Click Here If Redirect Fails!</a>
			</React.Fragment>
		);
	}
}
