import React from 'react'
import Table from '../Layout/GroupTable';
import ProfitProgress from '../Layout/ProfitProgress';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NavibarI from '../Layout/MyNavBarI';
import Searchbar from '../Layout/SearchBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//let fetch = require("fetch");

export default function DashboardI() {
    return (
      <React.Fragment>
      <NavibarI/>
          <h1 style={{textAlign:'center'}}> Dashboard </h1>
          <div style={{textAlign: 'right'}}>
          </div>
          <h2 style={{textAlign:'left'}}> Welcome Instructor </h2>
          <Nav>
            <NavDropdown title="Filter By" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Instructor</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Class</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">Section</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link eventKey={2} href="profile">
            </Nav.Link>
          </Nav>
          <div style={{textAlign: 'right'}}>
            <Searchbar />
         </div>
          <Table style = {{paddingTop: '10px 20px'}}></Table>
      </React.Fragment>
  )
}
