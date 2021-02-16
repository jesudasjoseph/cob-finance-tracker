import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';


function createData(gname, sname, sid, Instructor, Section) {
    return {gname, sname, sid, Instructor, Section};
  }
  const rows =[
    createData('Bennys Beavers', 'Jack Miller',933272728, 'Omar', 4),
    createData('Jeffersons Jelly', 'Ghaith Shan',933172823, 'Omar', 5)
  ]


export class Tables extends Component {
  constructor(props){
    super(props);
    this.state = {
        gname: '',
        sname:'',
        sid: '',
        Instructor: '',
        Section: ''}
        this.addTransaction = this.addTransaction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
          }

          handleChange(event) {
            this.setState({date: event.target.gname});
            this.setState({name: event.target.sname})
            this.setState({Customer: event.target.sid})
            this.setState({Location: event.target.Instructor})
            this.setState({Paymethod: event.target.Section})

          }

          handleSubmit(event) {
            event.preventDefault();
            this.addTransaction(event)
          }
          addTransaction(event , date, name){
            rows.push(createData(
                this.state.gname ,
                this.state.sname,
                this.state.sid,
                this.state.Instructor,
                this.state.Section))
          }
    render() {
      return (
         <div>
           <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
               <thead>
                   <tr>
                       <th>Group Name</th>
                       <th>Student Name </th>
                       <th>Student ID</th>
                       <th>Instructor</th>
                       <th>Section</th>
                       </tr>
                       </thead>
                       <tbody>
                       {rows.map((row) => (
                            <tr key={row.id}>
                                <td >{row.gname} </td>
                                    <td>{row.sname}</td>
                                    <td >{row.sid}</td>
                                    <td >{row.Instructor}</td>
                                    <td >{row.Section}</td>
                                    </tr>
         ))}
       </tbody>
     </Table>
     </div>
 );
   }
}

export default Tables
