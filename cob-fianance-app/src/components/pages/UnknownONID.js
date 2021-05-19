import React from 'react';
import Button from 'react-bootstrap/Button';
import { API_PATH } from '../Config';
export default class UnknownONID extends React.Component {
	render () {
		return (
			<React.Fragment >
				<div style={{padding: '180px 0 0 0', textAlign: 'center'}}>
					<h2>Your Onid was not recognized! Please contact your instructor.</h2>
					<a href="/home">Go back to Homepage</a>
				</div>
			</React.Fragment>
		);
	}
}
