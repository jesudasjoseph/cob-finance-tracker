import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';

import '../styles/SearchBar.css';

export default class SearchBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchValue: ''
		};

		this.onChange = this.onChange.bind(this);
		this.onClearClick = this.onClearClick.bind(this);
	}

	onChange(e){
		this.setState({searchValue: e.target.value});
		this.props.onChange(e.target.value);
	}

	onClearClick(){
		this.setState({searchValue: ''});
		this.props.onChange('');
	}

	render(){
		return(
			<>
				<div className='flex-container'>
					<Form onSubmit={(e) => {e.preventDefault();}}>
						<Form.Control className='search-bar' type='text' placeholder='Search...' value={this.state.searchValue} onChange={(e) => this.onChange(e)}/>
					</Form>
					<button className='clear-search' onClick={this.onClearClick}>x</button>
				</div>
			</>
		);
	}
}
