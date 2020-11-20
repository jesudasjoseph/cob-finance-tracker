import React, {Component} from 'react';
import Navbar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container';

class MyNavbar extends Component { 
  render(){
  return(
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="home">College of Buisness App</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="dashboard">Dashboard</Nav.Link>
      <Nav.Link href="transactions">Transactions</Nav.Link>
      <Nav.Link href="expenses">Expenses</Nav.Link>
    </Nav>
    <Nav>
      <NavDropdown title="User Profile" id="collasible-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>

        <NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link eventKey={2} href="profile">
        
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
  )
}
}
export default MyNavbar