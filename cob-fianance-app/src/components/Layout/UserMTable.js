import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';

export class Tables extends Component {
  constructor(props){
    super(props);
    this.state = {
        gname: '',
        sname:'',
        sid: '',
        Instructor: '',
        userTable: []}
        this.get_allusers = this.get_allusers.bind(this);
        this.get_allusers();
          }


        get_allusers(){
            fetch('http://71.193.191.23:2021/user?start=0&end=50', {
              mode: 'cors',
              method: 'GET',
              credentials: 'same-origin',
              headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': window.localStorage.getItem('jwt')
              }
            }).then(response => {
              console.log(response);
              return response.json();
            }).then(data => {
              console.log('Success:', data);
              this.setState({userTable:data});
            }).catch((error) => {
              console.error('Error:', error);
            });
          }

    render() {
      return (
         <div>
           <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
               <thead>
                   <tr>
                       <th>Group Name</th>
                       <th>Student First Name </th>
                       <th>Student Last Name </th>
                       <th>Onid ID </th>
                       <th>Section</th>
                       </tr>
                       </thead>
                       <tbody>
                       {this.state.userTable.map((student, index) => {
                          const {bid,uid,first, last,section} = student;
                          return (
                            <tr key={uid}>
                                <td> {bid} </td>
                                <td> {first} </td>
                                <td> {last} </td>
                                <td> {uid} </td>
                                <td> {section} </td>
                            </tr>
                          )
                          })}
                      </tbody>
            </Table>
     </div>
 );
   }
}

export default Tables
