import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

let containerStyle = {
	display: 'flex'
}
const profitBarStyle = {
	flexGrow: 3,
	fontSize: '1em',
	height: '2em'
}
const profitBarPlusStyle = {
	flexGrow: 1,
	fontSize: '1em',
	height: '2em'
}
const lossBarStyle = {
	flexGrow: 3,
	fontSize: '1em',
	height: '2em',
	transform: 'rotate(180deg)'
}

export class ProgressBarSmallProfit extends Component {
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
				const percentOfProfitGoal = profitGoal/100;
				const percentOfStretchGoal = profitStretchGoal/100;

				let lossPercent = 0;
				let profitPercent = 0;
				let stretchProfitPercent = 0;

				if (profit > 0){
					profitPercent = profit/percentOfProfitGoal;
					if (profit > profitGoal)
						stretchProfitPercent = profit/percentOfStretchGoal;
				}
				else {
					lossPercent = (0-profit)/percentOfProfitGoal;
				}

				return (
					<>
						<OverlayTrigger
							key="progressBar"
							placement="top"
							overlay={
								<Tooltip id={`tooltip-progressBar`} style={{fontSize: '1em'}}>
									${profit} / ${profitGoal}-${profitStretchGoal}
								</Tooltip>
							}
						>
							<div style={containerStyle}>
								<ProgressBar
									style={lossBarStyle}
									now={lossPercent}
									variant="danger"
								/>
								<ProgressBar
									style={profitBarStyle}
									now={profitPercent}
									variant="success"
								/>
								<ProgressBar
										style={profitBarPlusStyle}
										now={stretchProfitPercent}
										variant="success"
									/>
							</div>
						</OverlayTrigger>
					</>
				);
			}
		}
	}
}
export default ProgressBarSmallProfit
