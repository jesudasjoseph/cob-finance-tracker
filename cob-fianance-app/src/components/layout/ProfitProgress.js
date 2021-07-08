import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

import '../styles/ProfitProgress.css';

export class ProfitProgress extends Component {
	render() {
		if (this.props.profit === null){
			return (
				<>
					<div className='progressBarContainer'>
						<p className='centerText'>LOADING...</p>
					</div>
				</>
			)
		}
		else {
			let profit = parseFloat(this.props.profit);
			let profitGoal = parseFloat(this.props.profitGoal);
			let profitStretchGoal = parseFloat(this.props.profitStretchGoal);

			if (profitGoal === 0){
				return (
					<div className='progressBarContainer'>
						<p className='centerText'>Profit goal not Set!</p>
					</div>
				)
			}
			else {
				const percent_of_profit_goal = profitGoal/100;
				const percent_of_stretch_goal = profitStretchGoal/100;
				const profit_percent = parseFloat(profit/percent_of_profit_goal).toFixed(2);
				const stretch_percent = parseFloat(profit/percent_of_stretch_goal).toFixed(2);

				let lossLabel = '';
				let profitLabel = '';
				let stretchLabel = '';

				if (profit < 0) {
					lossLabel = '$'+profit;
				}
				else if (profit < profitGoal){
					profitLabel = '$'+profit+'/'+profitGoal+' ('+profit_percent+'%)'
				}
				else {
					profitLabel = '$'+profitGoal+'/'+profitGoal+' (100%)'
					stretchLabel = '$'+profit+'/'+profitStretchGoal+' ('+stretch_percent+'%)'
				}

				return (
					<>
						<div className='progressBarContainer'>
							<div className='lossBarDefault' style={{backgroundColor: (profit < 0) ? '#dc3545' : '#28a745' }}>
							</div>
							<ProgressBar
								className='profitBarDefault'
								variant="success"
								now={(profit > 0) ? profit_percent : 0}
								label={(profit > 0) ? `${profit_percent}%` : ''}
							/>
							<ProgressBar
								className='stretchBarDefault'
								now={(profit > profitGoal) ? stretch_percent : 0}
								variant="success"
							/>
						</div>
						<div className='labelContainer'>
							<p className='labelLoss'>{lossLabel}</p>
							<p className='labelProfit'>{profitLabel}</p>
							<p className='labelStretch'>{stretchLabel}</p>
						</div>
					</>
				)
			}
		}
	}
}
export default ProfitProgress
