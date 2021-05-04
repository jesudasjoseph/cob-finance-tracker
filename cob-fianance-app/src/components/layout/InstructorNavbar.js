import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

class InstructorNavbar extends Component {
	render(){
		return(
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Brand href="home">College of Buisness App</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="/instructor/dashboard">Dashboard</Nav.Link>
						<Nav.Link href="/instructor/depositdashboard">Deposit Dashboard</Nav.Link>
						<Nav.Link href="/instructor/usermanagement">User Management</Nav.Link>
						</Nav>
						<Nav>
						<Nav.Link href="/" onClick={localStorage.clear}>Logout</Nav.Link>
						<Nav.Link eventKey={2} href="profile">

						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}
export default InstructorNavbar
