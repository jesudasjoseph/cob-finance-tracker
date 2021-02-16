import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import ProfitProgress from '../Layout/ProfitProgress';

function createData(gname, Instructor, Revenue, Bank, Square, Expenses , Profits) {
    return { gname, Instructor, Revenue, Bank, Square, Expenses , Profits};
  }
  const rows =[
    createData('Bennys Beavers', 'Omar',700, 300, 400, 250, 450),
    createData('Jeffersons Jelly', 'Peach',700, 300, 400, 250, 450)
  ]


export class Tables extends Component {
  constructor(props){
    super(props);
    this.state = {
        gname: '',
        Instructor:'',
        Revenue: '',
        Bank: ''}
        this.addTransaction = this.addTransaction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
          }

          handleChange(event) {
            this.setState({date: event.target.gname});
            this.setState({name: event.target.Instructor})
            this.setState({Customer: event.target.Revenue})
            this.setState({Location: event.target.Bank})
            this.setState({Paymethod: event.target.Square})
            this.setState({product: event.target.Expenses})
            this.setState({quan: event.target.Profits})

          }

          handleSubmit(event) {
            event.preventDefault();
            this.addTransaction(event)
          }
          addTransaction(event , date, name){
            rows.push(createData(
                this.state.gname ,
                this.state.Instructor,
                this.state.Revenue,
                this.state.Bank,
                this.state.Square,
                this.state.Expenses,
                this.state.Profits))
          }
    render() {
      return (
         <div>
           <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
               <thead>
                   <tr>
                       <th>Group Name</th>
                       <th>Instructor</th>
                       <th>Revenue</th>
                       <th>Bank</th>
                       <th>Square</th>
                       <th>Expenses</th>
                       <th>Profits</th>
                       <th>Sales Goals</th>
                       </tr>
                       </thead>
                       <tbody>
                       {rows.map((row) => (
                            <tr key={row.id}>
                                <td> <a href="/GroupFinancials"> {row.gname} </a> </td>
                                    <td>{row.Instructor}</td>
                                    <td >{row.Revenue}</td>
                                    <td >{row.Bank}</td>
                                    <td >{row.Square}</td>
                                    <td >{row.Expenses}</td>
                                    <td >{row.Profits}</td>
                                    <td><ProfitProgress /></td>
                                    </tr>
         ))}
       </tbody>
     </Table>
     </div>
 );
   }
}

export default Tables
