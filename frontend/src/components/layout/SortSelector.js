import React, {Component} from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import './styles/SortSelector.css';

export default class SortSelector extends Component{
	constructor(props){
		super(props);
		this.state = {
			selectedOption: props.defaultOption
		}

		this.onClick = this.onClick.bind(this);
	}

	onClick(option){
		this.setState({selectedOption: option});
		this.props.onOptionChange(option);
	}

	render(){
		return(
			<>
				<div className='flex-container sort-selector-container'>
					<DropdownButton className='sort-selector-button' id='dropdown-basic-button' title={'sort by: ' + this.state.selectedOption}>
						{
							this.props.options.map((option, index) => {
								return(
										<Dropdown.Item onClick={()=>{this.onClick(option)}} key={option}>{option}</Dropdown.Item>
								);
							})
						}
					</DropdownButton>
				</div>
			</>
		);
	}
}
