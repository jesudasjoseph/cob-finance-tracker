import React, { Component } from 'react';

import './styles/CircleProfitProgress.css';

//Expected Props
//proft, goal, stretchGoal

export default class CircleProfitProgress extends Component {
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
			let profitGoal = parseFloat(this.props.goal);
			let profitStretchGoal = parseFloat(this.props.stretchGoal);

			if (profitGoal === 0){
				return (
					<div>
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
				
				//SVG Progress Variables
				const myText = '440'; 
				const progress = 80;
				const width = 200;
				const cycx = width/2;
				const radius = 100;

				return (
					<>
						<div className='circle-progress-container' style={{width: '200px', height: '200px'}}>
							<p className='circle-progress-label'>${myText}</p>
							<svg id='svg' className='circle-progress-svg'>
								<circle id='circle' 
									className='circle-progress-base-ring'
									stroke="white"
									fill="transparent"
									style={{
											r: radius,
											strokeDasharray: `${80*Math.PI}% ${200*Math.PI}%`,
											strokeDashoffset: `${20*Math.PI}%`,
											transform: `rotate(${90}deg)`,
											transformOrigin: "50% 50%"}}
									/>
								
							</svg>
						</div>
					</>
				)
			}
		}
	}
}
/*
<circle 
									className='circle-progress-base-ring'
									stroke="green"
									fill="transparent"
									style={{
											strokeDasharray: '100% 200%',
											strokeDashoffset: '20%',
											transform: `rotate(${degreeOffset}deg)`,
											transformOrigin: "50% 50%"}}
									/>
*/