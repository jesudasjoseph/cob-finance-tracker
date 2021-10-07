import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class ProfitGoalsForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			hasCompany: true,
			company_id: '',
			profit_goal: 0,
			stretch_profit_goal: 0
		};

		this.handle_submit = this.handle_submit.bind(this);
		this.handleProfitGoalChange = this.handleProfitGoalChange.bind(this);
		this.handleStretchProfitGoalChange = this.handleStretchProfitGoalChange.bind(this);
	}

	componentDidMount(){
		fetch(process.env.REACT_APP_API_PATH + '/business/byuid', {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			}
		}).then(response => {
			if (response.status === 404){
				this.setState({hasCompany: false});
			}
			else {
				return response.json();
			}
		}).then(data => {
			console.log('Success:', data);
			this.setState({
				profit_goal:data[0].profit_goal,
				stretch_profit_goal:data[0].stretch_profit_goal,
				company_id:data[0].company_id
			});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handle_submit(e) {
		e.preventDefault();

		const body = {profit_goal: this.state.profit_goal, stretch_profit_goal: this.state.stretch_profit_goal};
		fetch(process.env.REACT_APP_API_PATH + '/business/byuid/profit_goal', {
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
		}).catch((error) => {
			console.error('Error:', error);
		});
		fetch(process.env.REACT_APP_API_PATH + '/business/byuid/stretch_profit_goal', {
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
			this.setState({profit_goal_current:this.state.profit_goal
			});
		}).catch((error) => {
			console.error('Error:', error);
		});

	}

	handleProfitGoalChange(e) {
		this.setState({profit_goal: e.target.value});
	}

	handleStretchProfitGoalChange(e) {
		this.setState({stretch_profit_goal: e.target.value});
	}

	render() {
		if (this.state.hasCompany) {
			return (
				<>
					<Form onSubmit={this.handle_submit}>
						<Form.Group>
							<Form.Label>Minimum Profit Goal</Form.Label>
							<Form.Control type="number" value={this.state.profit_goal}  onChange={this.handleProfitGoalChange} />
							<Form.Label>Stretch Profit Goal</Form.Label>
							<Form.Control type="number" value={this.state.stretch_profit_goal} onChange={this.handleStretchProfitGoalChange} />
						</Form.Group>
						<Button variant="primary" type="submit">Save</Button>
					</Form>
				</>
			);
		}
		else {
			return (
				<>
					<h3>You are currently not part of a company! Please contact your instructor!</h3>
				</>
			);
		}
	}
}
