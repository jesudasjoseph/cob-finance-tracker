import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

export class Buttons extends Component {
    render() {
        return (
          <>
        <Button type="submit">Add Student</Button>{' '}
        <Button as="input" type="button" value="Import Students" />{' '}
        <Nav>
        <NavDropdown title="Filter By" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Instructor</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Class</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.4">Other</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        </>
        )
    }
}

export default Buttons
