import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

export class UserMButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bid: '',
        fname: '',
        lname:'',
        OnidID: '',
        section: '',
        role: ''}
    this.PopStudent = this.PopStudent.bind(this);
  }
  PopStudent(){
    this.state.bid = prompt('Please enter BID');
    this.state.fname = prompt('Please enter First Name');
    this.state.lname = prompt('Please enter Last Name');
    this.state.OnidID = prompt('Please enter OnidID');
    this.state.section = prompt('Please enter Section Number');
    this.state.role = prompt('Please enter the Role');
    console.log("this is the onidID" + this.state.onidID);

    let bod = {user:{uid:this.state.OnidID, first:this.state.fname, last: this.state.lname, role:this.state.role}}
    fetch('http://' + '71.193.191.23' + ':2021/user', {
      mode: 'cors',
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': window.localStorage.getItem('jwt')
      },
      body: JSON.stringify(bod)
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(data => {
      console.log('Success:', data);
    }).catch((error) => {
      console.error('Error:', error);
    });

    let bodd = {user:{uid:this.state.OnidID,bid: this.state.bid}}
    fetch('http://' + '71.193.191.23' + ':2021/user/addtobusiness', {
      mode: 'cors',
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': window.localStorage.getItem('jwt')
      },
      body: JSON.stringify(bodd)
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(data => {
      console.log('Success:', data);
    }).catch((error) => {
      console.error('Error:', error);
    });




  }


    render() {
        return (
          <>
        <Button type="input"  type="button" onClick = {this.PopStudent}>Add Student</Button>{' '}
        <Button as="input" type="button" value="Import Students" />{' '}
        <Nav>
        <NavDropdown title="Filter By" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#filterI">Instructor</NavDropdown.Item>
          <NavDropdown.Item href="#filterS">Section</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        </>
        )
    }
}

export default UserMButtons
