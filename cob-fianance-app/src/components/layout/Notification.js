import React, {Component} from 'react';

import '../styles/Notification.css';

export default class Notification extends Component {
	
	componentDidUpdate(){
		if (this.props.show && this.props.timeout)
			setTimeout(this.props.onClose, parseInt(this.props.timeout));
	}

	render(){
		if (this.props.show){
			return(
				<>
					<div className={'notification-alert ' + this.props.type} onClick={this.props.onClose}>
						<h6>{this.props.title}</h6>
						<button onClick={this.props.onClose}>x</button>
						<p>
						{this.props.content}
						</p>
					</div>
				</>
			);
		}
		else {
			return(<></>);
		}
	}
}
