import React, { Component } from 'react';

import './styles/CircleProfitProgress.css';

//Expected Props
//proft, goal, stretchGoal

export default class CircleProfitProgress extends Component {
	render() {
		if (isNaN(this.props.profit)){
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
			let goal = parseFloat(this.props.goal);
			let stretchGoal = parseFloat(this.props.stretchGoal);

			if (goal === 0 || stretchGoal === 0){
				return (
					<div>
						<p className='centerText'>Profit goals not Set!</p>
					</div>
				)
			}
			else {
				let hasProfit = true;
				let progress = 0;

				//When progress is equal to this it reaches the marker in the graphic
				const goalMarker = 64;
				const stretchGoalMarker = 100;

				const percent_of_profit_goal = goal/100;
				const percent_of_stretch_goal = stretchGoal/100;
				const profit_percent = parseFloat((profit/percent_of_profit_goal)*(goalMarker/100)).toFixed(2);
				const stretch_percent = parseFloat(profit/percent_of_stretch_goal*(stretchGoalMarker/100)).toFixed(2);

				if (profit < 0){
					hasProfit = false;
				}
				else if (profit <= goal){
					progress = profit_percent;
				}
				else {
					progress = stretch_percent + goalMarker;
				}
				
				const height = this.props.style ? this.props.style.height : 300;

				const svgContainerStyle = {
					width: `${height+120}px`,
					height: `${height}px`
				}

				return (
					<>
						<div className='circle-progress-container' style={svgContainerStyle}>
							<svg id='svg' className='circle-progress-svg' 
								viewBox='0 0 100 100'>
								<circle
									fill="transparent"
									width="80"
									height="800"
									r="40"
									cx="50"
									cy="50"
									stroke={hasProfit ? 'white' : 'red'}
									strokeWidth="13"
									strokeDasharray="201 500"
									style={{
										transform: 'rotate(126deg)',
										transformOrigin: '50% 50%'
									}}
									/>
								<circle
									fill="transparent"
									width="80"
									height="80"
									r="40"
									cx="50"
									cy="50"
									stroke="black"
									strokeWidth="13"
									strokeDasharray="200 400"
									strokeDashoffset={(200 - progress*2).toString()}
									style={{
										transform: 'rotate(126deg)',
										transformOrigin: '50% 50%',
										opacity: hasProfit ? '1' : '0'
									}}
									/>
								<circle
									fill="transparent"
									width="80"
									height="80"
									r="42"
									cx="50"
									cy="50"
									stroke="#4a4a4a"
									strokeWidth="18"
									strokeDasharray="1.5 75 1.5 300"
									style={{
										transform: 'rotate(-52deg)',
										transformOrigin: '50% 50%',
										opacity: hasProfit ? '1' : '0'
									}}
									/>
								<text
									className="circle-progress-profit-label"
									x="50"
									y="50"
									fontSize="14"
									textAnchor="middle"
									fill="black">
									{hasProfit ? '$' + profit : `($${0-profit})`}
								</text>
								<text
									className="circle-progress-label"
									x="50"
									y="88"
									fontSize="12"
									textAnchor="middle"
									fill={hasProfit ? 'green' : 'red'}>
									{hasProfit ? 'Profit' : 'Loss'}
								</text>
								<text
									className="circle-progress-goal-label"
									x="85"
									y="10"
									fontSize="8"
									textAnchor="left"
									fill="black">
									{hasProfit ? '$' + this.props.goal : ''}
								</text>
								<text
									className="circle-progress-stretch-label"
									x="85"
									y="95"
									fontSize="8"
									textAnchor="left"
									fill="black">
									{hasProfit ? '$' + this.props.stretchGoal : ''}
								</text>
							</svg>
						</div>
					</>
				)
			}
		}
	}
}