import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import AddStudentDialogButton from './AddStudentDialogButton.js';

export class UserMButtons extends Component {
	render() {
		return (
			<>
				<AddStudentDialogButton/>
				<Button as="input" type="button" value="Import Students" />
			</>
		)
	}
}
export default UserMButtons
