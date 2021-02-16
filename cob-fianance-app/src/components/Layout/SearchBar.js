import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export class SearchBar extends Component{
  render() {
      return (
        <>
        <Form inline>
       <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
       <Button variant="outline-success">Search</Button>
        </Form>
        </>
      )
    }
  }

  export default SearchBar
