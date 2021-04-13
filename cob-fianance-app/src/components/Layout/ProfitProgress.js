import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

export class ProfitProgress extends Component {
	constructor(props){
		super(props);
		this.state = {
			profitbar: '',
			expensesbar: '',
			business: null
		}

		this.get_business = this.get_business.bind(this);
	}

	componentDidMount(){
		this.get_business();
	}

	get_business(){
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

	render() {
		if (this.state.business === null){
			return (
					<div>LOADING...</div>
			)
		}
		else {
			let {deposit_count, deposit_total, expense_count, expense_total, name, product_count, profit, profit_goal, stretch_profit_goal} = this.state.business;

			profit_goal = parseFloat(profit_goal.split("$")[1]);
			stretch_profit_goal = parseFloat(stretch_profit_goal.split("$")[1]);

			if (profit_goal === 0){
				return (
						<div>Profit goal not Set!</div>
				)
			}
			else {
				console.log(profit);
				profit = profit.split("$")[1];
				console.log(profit);
				profit = parseFloat(profit);
				console.log(profit);
				expense_total = parseFloat(expense_total.split("$")[1]);
				const percent_of_profit_goal = profit_goal/100;
				const profit_percent = profit/percent_of_profit_goal;

				console.log(profit);
				if (profit < 0){
					//Display Negative Profit Bar
					console.log(profit);
				}
				else if (profit_percent < 25){
					return (
						<ProgressBar style={{height:'50px', minWidth:100}} now={profit_percent} variant="danger" label={`$${profit}/$${profit_goal}, ${profit_percent}%`}/>
					)
				}
				else if (profit_percent < 75){
					return (
						<ProgressBar style={{height:'50px', minWidth:100}} now={profit_percent} variant="warning" label={`$${profit}/$${profit_goal}, ${profit_percent}%`}/>
					)
				}
				else{
					return (
						<ProgressBar style={{height:'50px', minWidth:100}} now={profit_percent} variant="success" label={`$${profit}/$${profit_goal}, ${profit_percent}%`}/>
					)
				}
			}
		}
			//if(a<25){
			//	return (
			//		<ProgressBar style= {{height:'50px'}} now={100*a/goal} variant="danger" label={`${100*a/goal}%`} />
			//	)
			//}
			//if(a>25 && a<100){
			//	return (
			//		<ProgressBar style= {{height:'50px'}} now={100*a/goal} variant="warning" label={`${a}%`} />
			//	)
			//}
			//if(a>=100){
			//	return (
			//		<ProgressBar style= {{height:'50px'}} now={100*a/goal} variant="success" label={`GOAL REACHED: ${100*a/goal}%`} />
			//	)
			//}
	}
}


export default ProfitProgress
