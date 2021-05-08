import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';

class InstructorNavbar extends Component {
	render(){
		return(
			<Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Brand as={Link} to="/home">College of Buisness App</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/instructor/dashboard">Dashboard</Nav.Link>
						<Nav.Link as={Link} to="/instructor/bank">Bank</Nav.Link>
						<Nav.Link as={Link} to="/instructor/usermanagement">UserManagement</Nav.Link>
					</Nav>
					<Nav>
						<Nav.Link as={Link} to="/home" onClick={() => {window.localStorage.clear();}}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}
export default InstructorNavbar
