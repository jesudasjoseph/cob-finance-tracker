import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { API_PATH } from '../Config';

export class ProfitGoalsForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			bid: '',
			saveEnabled: false,
			saveText: 'saved',
			profit_goal_current: 0,
			stretch_profit_goal_current: 0,
			profit_goal: 0,
			stretch_profit_goal: 0
		};

		this.handle_submit = this.handle_submit.bind(this);
		this.renderSaveButton = this.renderSaveButton.bind(this);
		this.handleProfitGoalChange = this.handleProfitGoalChange.bind(this);
		this.handleStretchProfitGoalChange = this.handleStretchProfitGoalChange.bind(this);
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
				profit_goal_current:data[0].profit_goal,
				stretch_profit_goal_current:data[0].stretch_profit_goal,
				profit_goal:data[0].profit_goal,
				stretch_profit_goal:data[0].stretch_profit_goal,
				bid:data[0].bid
			});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handle_submit(e) {
		e.preventDefault();

		const body = {profit_goal: this.state.profit_goal, stretch_profit_goal: this.state.stretch_profit_goal};
		fetch(API_PATH + '/business/byuid/profit_goal', {
			mode: 'cors',
			method: 'PUT',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(body)
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
		fetch(API_PATH + '/business/byuid/stretch_profit_goal', {
			mode: 'cors',
			method: 'PUT',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(body)
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			this.setState({profit_goal_current:this.state.profit_goal,
				stretch_profit_goal_current:this.state.stretch_profit_goal,
				saveEnabled: false,
				saveText: 'saved'
			});
		}).catch((error) => {
			console.error('Error:', error);
		});

	}

	renderSaveButton() {
		if (this.state.saveEnabled === true)
			return (
				<Button variant="primary" type="submit">{this.state.saveText}</Button>
			);
		else
			return (
				<Button variant="primary" type="submit" disabled>{this.state.saveText}</Button>
			);
	}

	handleProfitGoalChange(e) {
		this.setState({profit_goal: e.target.value});
		if (this.state.profit_goal !== this.state.profit_goal_current) {
			this.setState({saveEnabled: true,
					saveText: 'save'
				});
		}
	}

	handleStretchProfitGoalChange(e) {
		this.setState({stretch_profit_goal: e.target.value});
		if (this.state.stretch_profit_goal !== this.state.stretch_profit_goal_current) {
			this.setState({saveEnabled: true});
		}
	}

	render() {
		return (
			<>
				<Form onSubmit={this.handle_submit}>
					<Form.Group>
						<Form.Label>Profit Goal</Form.Label>
						<Form.Control type="number" value={this.state.profit_goal}  onChange={this.handleProfitGoalChange} />
						<Form.Label>Profit Stretch Goal</Form.Label>
						<Form.Control type="number" value={this.state.stretch_profit_goal} onChange={this.handleStretchProfitGoalChange} />
					</Form.Group>
					<this.renderSaveButton />
				</Form>
			</>
		)
	}
}
export default ProfitGoalsForm
