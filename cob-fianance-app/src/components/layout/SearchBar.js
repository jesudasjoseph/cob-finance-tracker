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

	onClearClick(e){
		e.preventDefault();
		this.setState({searchValue: ''});
		this.props.onChange('');
	}

	render(){
		return(
			<>
				<div className='flex-container'>
					<Form>
						<Form.Control className='search-bar' type='text' placeholder='Search...' value={this.state.searchValue} onChange={(e) => this.onChange(e)}/>
						<button className='clear-search' onClick={(e) => this.onClearClick(e)}>x</button>
					</Form>
				</div>
			</>
		);
	}
}
