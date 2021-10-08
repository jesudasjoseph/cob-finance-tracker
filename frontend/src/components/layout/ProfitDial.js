import React, { Component } from 'react';

import './styles/ProfitDial.css';

//Expected Props
//proft, goal, stretchGoal

export default class ProfitDial extends Component {
	render() {
		if (isNaN(this.props.profit)){
			return (
				<>
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
						<p className={'centerText ' + (this.props.className ? this.props.className : '')} style={this.props.style ? this.props.style : {}}>Profit goals not Set!</p>
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

				return (
					<>
						<svg id='svg' className={'profit-dial-svg ' + (this.props.className ? this.props.className : '')} style={this.props.style ? this.props.style : {}}
							viewBox='0 0 140 140'>
							<circle
								fill="transparent"
								width="80"
								height="800"
								r="40"
								cx="70"
								cy="70"
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
								cx="70"
								cy="70"
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
								cx="70"
								cy="70"
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
								className="profit-dial-label"
								x="70"
								y="75"
								fontSize="14"
								textAnchor="middle"
								fill="black">
								{hasProfit ? '$' + profit : `($${0-profit})`}
							</text>
							<text
								className="profit-dial-label"
								x="70"
								y="110"
								fontSize="12"
								textAnchor="middle"
								fill={hasProfit ? 'green' : 'red'}>
								{hasProfit ? 'Profit' : 'Loss'}
							</text>
							<text
								className="profit-dial-goal-label"
								x="105"
								y="30"
								fontSize="8"
								textAnchor="left"
								fill="black">
								{hasProfit ? '$' + this.props.goal : ''}
							</text>
							<text
								className="profit-dial-stretch-label"
								x="105"
								y="115"
								fontSize="8"
								textAnchor="left"
								fill="black">
								{hasProfit ? '$' + this.props.stretchGoal : ''}
							</text>
						</svg>
					</>
				)
			}
		}
	}
}