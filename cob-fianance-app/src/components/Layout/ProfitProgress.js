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
	render() {
		if (this.props.profit === null){
			return (
					<div>LOADING...</div>
			)
		}
		else {
			let profit = parseFloat(this.props.profit);
			let profitGoal = parseFloat(this.props.profitGoal);
			let profitStretchGoal = parseFloat(this.props.profitStretchGoal);

			if (profitGoal === 0){
				return (
						<div>Profit goal not Set!</div>
				)
			}
			else {
				const percent_of_profit_goal = profitGoal/100;
				const percent_of_stretch_goal = profitStretchGoal/100;
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
						</div>
					)
				}
				else if (profit_percent < 25){
					return (
						<ProgressBar
							style={profitBarStyle}
							now={profit_percent}
							variant="danger"
							label={`Profit Goal ${profit_percent}% reached! ($${profit}/$${profitGoal})`}/>
					)
				}
				else if (profit_percent < 75){
					return (
						<ProgressBar
							style={profitBarStyle}
							now={profit_percent}
							variant="warning"
							label={`Profit Goal ${profit_percent}% reached! ($${profit}/$${profitGoal})`}/>
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
									label={`Profit Goal Reached! ($${profitGoal}/$${profitGoal})`}/>
							</div>
							<div style={profitBarPlusContainerStyle}>
								<ProgressBar
									style={profitBarPlusStyle}
									now={stretch_percent}
									variant="success"
									label={`Stretch Goal: ($${profit}/$${profitStretchGoal})`}/>
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
							label={`$${profit}/$${profitGoal}, ${profit_percent}%`}/>
					);
				}
			}
		}
	}
}


export default ProfitProgress
