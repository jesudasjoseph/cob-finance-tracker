import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

const containerStyle = {
	display: 'flex'
}
const profitBarContainerStyle = {
	flexGrow: 3
}
const profitBarStyle = {
	height: '50px',
	minWidth: 100
}
const profitBarPlusContainerStyle = {
	flexGrow: 7
}
const profitBarPlusStyle = {
	height: '50px',
	minWidth: 100
}
const lossBarContainerStyle = {
	flexGrow: 1
}
const lossBarStyle = {
	height: '50px',
	minWidth: 100
}

export class ProfitProgress extends Component {
	constructor(props){
		super(props);
		this.state = {
			profitbar: '',
			expensesbar: '',
			business: null
		}

		this.get_business_byuid = this.get_business_byuid.bind(this);
		this.get_business_bybid = this.get_business_bybid.bind(this);
	}

	componentDidMount(){
		//Check to see if a bid was passed to the Component
		if (this.props.dataFromParent === undefined)
			this.get_business_byuid();
		else
			this.get_business_bybid(this.props.dataFromParent);
	}

	get_business_byuid(){
		fetch('http://' + '71.193.191.23' + ':2021/business/byuid', {
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
			this.setState({business:data[0]});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	get_business_bybid(bid){
		fetch('http://' + '71.193.191.23' + ':2021/business/bybid?bid=' + bid, {
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
			this.setState({business:data[0]});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render() {
		if (this.state.business === null){
			return (
					<div>LOADING...</div>
			)
		}
		else {
			let {deposit_count, deposit_total, expense_count, expense_total, name, product_count, profit, profit_goal, stretch_profit_goal} = this.state.business;

			if (profit_goal === 0){
				return (
						<div>Profit goal not Set!</div>
				)
			}
			else {
				const percent_of_profit_goal = profit_goal/100;
				const percent_of_stretch_goal = stretch_profit_goal/100;
				const profit_percent = profit/percent_of_profit_goal;
				const stretch_percent = profit/percent_of_stretch_goal;

				if (profit < 0){
					return (
						<div style={containerStyle}>
							<div style={lossBarContainerStyle}>
								<ProgressBar
									style={lossBarStyle}
									now={100}
									variant="danger"
									label={`$${profit} Loss`}/>
							</div>
							<div style={profitBarContainerStyle}>
								<ProgressBar
									style={profitBarStyle}
									now={100}
									variant="info"
									label={`Profit Goal: ($${profit_goal})`}/>
							</div>
						</div>
					)
				}
				else if (profit_percent < 25){
					return (
						<ProgressBar
							style={profitBarStyle}
							now={profit_percent}
							variant="danger"
							label={`Profit Goal ${profit_percent}% reached! ($${profit}/$${profit_goal})`}/>
					)
				}
				else if (profit_percent < 75){
					return (
						<ProgressBar
							style={profitBarStyle}
							now={profit_percent}
							variant="warning"
							label={`Profit Goal ${profit_percent}% reached! ($${profit}/$${profit_goal})`}/>
					)
				}
				else if (profit_percent > 100) {
					return (
						<div style={containerStyle}>
							<div style={profitBarContainerStyle}>
								<ProgressBar
									style={profitBarStyle}
									now={100}
									variant="success"
									label={`Profit Goal Reached! ($${profit_goal}/$${profit_goal})`}/>
							</div>
							<div style={profitBarPlusContainerStyle}>
								<ProgressBar
									style={profitBarPlusStyle}
									now={stretch_percent}
									variant="success"
									label={`Stretch Goal: ($${profit}/$${stretch_profit_goal})`}/>
							</div>
						</div>
					);
				}
				//If all else fails return a progress bar
				else {
					return (
						<ProgressBar
							style={profitBarStyle}
							now={profit_percent}
							variant="success"
							label={`$${profit}/$${profit_goal}, ${profit_percent}%`}/>
					);
				}
			}
		}
	}
}


export default ProfitProgress
