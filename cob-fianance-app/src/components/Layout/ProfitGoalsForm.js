import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export class ProfitGoalsForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			bid: '',
			profit_goal: 0,
			stretch_profit_goal: 0
		};

		this.handle_submit = this.handle_submit.bind(this);
	}

	componentDidMount(){
		fetch(API_PATH + '/business/byuid', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			this.setState({
				profit_goal:data.profit_goal,
				stretch_profit_goal:data.stretch_profit_goal,
				bid:data.bid
			});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handle_submit(e) {
		e.preventDefault();
	}

	render() {
		return (
			<>
				<Form onSubmit={this.handle_submit}>
					<Form.Group>
						<Form.Label>Profit Goal</Form.Label>
						<Form.Control type="number" value={this.state.profit_goal}  onChange={(e) => this.setState({profit_goal: e.target.value})} />
						<Form.Label>Profit Stretch Goal</Form.Label>
						<Form.Control type="number" value={this.state.stretch_profit_goal} onChange={(e) => this.setState({stretch_profit_goal: e.target.value})} />
					</Form.Group>
					<Button variant="primary" type="submit">Save</Button>
				</Form>
			</>
		)
	}
}
export default ProfitGoalsForm
