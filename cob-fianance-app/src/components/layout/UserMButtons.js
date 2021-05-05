import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import AddStudentDialogButton from './AddStudentDialogButton.js';
import ImportStudentButton from './ImportStudentButton.js'

export class UserMButtons extends Component {
	render() {
		return (
			<>
				<AddStudentDialogButton/>
				<ImportStudentButton/>
			</>
		)
	}
}
export default UserMButtons
