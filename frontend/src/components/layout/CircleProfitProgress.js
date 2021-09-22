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
				
				//In Picxels
				const width = 200;

				const strokeWidth = width/6;
				const diameter = width - strokeWidth;
				const radius = diameter/2;
				const circumference = diameter*Math.PI;
				

				//Progress in percent
				let progress = 100;

				const svgContainerStyle = {
					width: `${diameter}px`,
					height: `${diameter}px`
				}

				const circleStyle = {
					width: `${width}px`,
					height: `${width}px`,
					r: `${radius}px`,
					strokeDasharray: `${circumference*0.80} ${circumference+2}`,
					strokeDashoffset: `${circumference*0.0080*(100-progress)}px`,
					transform: `rotate(${90+360*0.1}deg)`,
					transformOrigin: `50% 50%`,
					cx: `${width/2}px`,
					cy: `${width/2}px`,
					strokeWidth: `${strokeWidth}px`
				};

				//SVG Progress Variables
				const myText = '440';

				return (
					<>
						<div className='circle-progress-container' style={svgContainerStyle}>
							<p className='circle-progress-label'>${myText}</p>
							<svg id='svg' className='circle-progress-svg' viewBox={"0 0 " + width + " " + width}>
								<circle
									stroke="white"
									fill="transparent"
									style={circleStyle}
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