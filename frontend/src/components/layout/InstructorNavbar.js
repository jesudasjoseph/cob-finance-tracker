import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Link} from 'react-router-dom';

export default class InstructorNavbar extends Component {
	render(){
		return(
			<>
				<Navbar sticky="top" collapseOnSelect expand="sm" bg="dark" variant="dark">
					<Navbar.Brand as={Link} to="/instructor/dashboard">College of Buisness App</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="ml-auto">
							<Nav.Link as={Link} to="/instructor/dashboard">Dashboard</Nav.Link>
							<Nav.Link as={Link} to="/instructor/bank">Bank</Nav.Link>
							<Nav.Link as={Link} to="/instructor/usermanagement">Users</Nav.Link>
						</Nav>
						<DropdownButton title={window.localStorage.getItem('user_id')} variant="dark" menuAlign="right">
							<Dropdown.Item as={Link} to="/instructor/database">Database</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item as={Link} to="/home" onClick={() => {window.localStorage.clear();}}>Logout</Dropdown.Item>
						</DropdownButton>
					</Navbar.Collapse>
				</Navbar>
			</>
		)
	}
}
