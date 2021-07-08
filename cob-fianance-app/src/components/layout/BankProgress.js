import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

export class BankProgress extends Component {
	render() {
		return (
			<React.Fragment>
				<ProgressBar style={{fontSize: '1em', height: '1.4em'}} variant="dark" now={100} label={`Total Revenue = $${this.props.revenue}`} />
				<ProgressBar style={{fontSize: '1em', height: '3em'}}>
					<ProgressBar style={{minWidth: '10em'}} variant="blue" now={this.props.square/this.props.revenue*100} key={1} label={`Square = $${this.props.square}`} />
					<ProgressBar style={{minWidth: '10rem'}} variant="success" now={this.props.bank/this.props.revenue*100} key={2} label={`Bank = $${this.props.bank}`}/>
				</ProgressBar>
			</React.Fragment>
		)
	}
}
export default BankProgress
