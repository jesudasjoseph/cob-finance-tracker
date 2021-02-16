import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

export class UserMButtons extends Component {
  handleclick(event){
    alert('You clicked Instructor ');
    event.preventDefault();
  }

    render() {
        return (
          <>
        <Button type="submit">Add Student</Button>{' '}
        <Button as="input" type="button" value="Import Students" />{' '}
        <Nav>
        <NavDropdown title="Filter By" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#filterI" OnClick = {this.handleclick} >Instructor</NavDropdown.Item>
          <NavDropdown.Item href="#filterC">Class</NavDropdown.Item>
          <NavDropdown.Item href="#filterS">Section</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        </>
        )
    }
}

export default UserMButtons
