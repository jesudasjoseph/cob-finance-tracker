import React from 'react'
import { API_PATH } from '../../Config';

export default class DepositDashboard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			bid: this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1],
			depositData: [],
			businessData: []
		};

		this.fetchDepositData = this.fetchDepositData.bind(this);
		this.fetchBusinessData = this.fetchBusinessData.bind(this);
	}

	componentDidMount(){
		this.fetchDepositData();
	}

	fetchBusinessData(){
		fetch(API_PATH + '/business/bybid?bid=' + this.state.bid, {
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
			this.setState({businessData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	fetchDepositData(){
		fetch(API_PATH + '/deposit?start=0&end=50&bid=' + this.state.bid, {
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
			this.setState({depositData:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	render () {
		return (
			<React.Fragment>
				<div>

				</div>
				<div>
				</div>
			</React.Fragment>
		)
	}

}
