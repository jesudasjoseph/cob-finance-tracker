import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap/Table';

import './styles/Table.css';

/*
Props:
onClose()
onSuccess()
show
*/

export default class Table extends Component {
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
					<div>
						{this.props.children}
					</div>
				</>
			);
		}
		else {
			return (
				<>
					<BootstrapTable responsive size="m" striped bordered hover variant="dark">
						<thead>
							<tr>
								{this.props.titles.map((title, index) => {
									return (
										<th key={title+index}>{title}</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{this.props.children}
						</tbody>
					</BootstrapTable>
				</>
			);
		}
	}
}

