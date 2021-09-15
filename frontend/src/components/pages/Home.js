import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'

export default class Page_404 extends Component {
	render(){
		return(
			<>
				<div style={{padding: '180px 0 0 0', textAlign: 'center'}}>
					<h1><b>Welcome to the OSU College of Business Finance App!</b></h1>
					<Button href="/login">Login Here!</Button>
				</div>
			</>
		);
	}
}
