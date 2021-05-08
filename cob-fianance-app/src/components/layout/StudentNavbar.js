import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';

class StudentNavbar extends Component {
	render(){
		return(
			<Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Brand as={Link} to="/home">College of Buisness App</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
						<Nav.Link as={Link} to="/student/transactions">Transactions</Nav.Link>
						<Nav.Link as={Link} to="/student/expenses">Expenses</Nav.Link>
					</Nav>
					<Nav>
						<NavDropdown title="User Profile" id="collasible-nav-dropdown">
							<NavDropdown.Item as={Link} to="#action/3.1">My Profile</NavDropdown.Item>
							<NavDropdown.Item as={Link} to="/student/settings">Settings</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item as={Link} to="/home" onClick={() => {window.localStorage.clear();}}>Logout</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link eventKey={2} as={Link} to="/student/profile"></Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}
export default StudentNavbar
