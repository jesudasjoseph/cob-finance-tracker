import React, { Component } from 'react';

import './styles/TableItem.css';

export default class TableItem extends Component {

	constructor(props){
		super(props);
		this.state = {
			smallWindow: false
		};

		this.checkWidth = this.checkWidth.bind(this);
	}

	checkWidth(){
		const match = window.matchMedia(`(max-width: 768px)`);
		this.setState({smallWindow: match.matches});
	}

	componentDidMount(){
		this.checkWidth();
	}

	render() {
		if (this.state.smallWindow){
			return (
				<>
					<div className='table-item-container'>
						<p className='table-item-date'>{this.props.date.split('T')[0]}</p>
						<div className='table-item-top-left'>
							<p className='table-item-title'>{this.props.product}</p>
							<p className='table-item-subtitle'>{this.props.customer}</p>
						</div>
						<div className='table-item-bottom-left'>
							<p className='table-item-total'>{this.props.total}</p>
							<p className='table-item-quantity'>({this.props.quantity}</p>
							<p className='table-item-times'>x</p>
							<p className='table-item-unit-price'>{this.props.price_per_unit})</p>
						</div>
						<p className='table-item-payment'>{this.props.payment_method}</p>

					</div>
				</>
			);
		}
		else {
			return (
				<>
					<tr>
						<td>{this.props.date.split('T')[0]}</td>
						<td>{this.props.customer}</td>
						<td>{this.props.product}</td>
						<td>{this.props.payment_method}</td>
						<td>{this.props.quantity}</td>
						<td>{this.props.price_per_unit}</td>
						<td>{this.props.total}</td>
					</tr>
				</>
			);
		}
	}
}