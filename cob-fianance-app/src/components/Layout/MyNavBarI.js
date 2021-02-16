import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
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
      <Nav.Link href="DashboardI">Dashboard</Nav.Link>
      <Nav.Link href="UserManagement">User Management</Nav.Link>
    </Nav>
    <Nav>
      <NavDropdown title="User Profile" id="collasible-nav-dropdown">
        <NavDropdown.Item href="/Profile"> My Profile </NavDropdown.Item>
        <NavDropdown.Item href="/SettingsInstuctor">Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/">Logout</NavDropdown.Item>
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
