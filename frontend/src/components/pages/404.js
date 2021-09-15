import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'

export default class Page_404 extends Component {
	render(){
		return(
			<>
				<div style={{padding: '180px 0 0 0', textAlign: 'center'}}>
					<Button href="/home">Back to Homepage</Button>
					<p style={{fontSize: '8em', color: '#ba3434'}}><b>404</b></p>
					<p>{window.location.toString()}</p>
					<p>Page Not Found!</p>
				</div>
			</>
		);
	}
}
