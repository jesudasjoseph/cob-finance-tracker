import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';


function createData(id,date, name, Customer, Location, Paymethod, product , quan , price, total) {
    return { date, name, Customer, Location, Paymethod, product , quan , price, total};
  }
  const rows =[
    createData('1', '01', 'me', 'customer1', 'location1', 'Paymethod1','goods1', 54,100 , 12341234),
    createData('2','02', 'me2', 'customer2', 'location2', 'Paymethod2', 'goods2' , 59,100 , 543543)
  ]
export class Tables extends Component {
    render() {
        return (
            <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Date:</th>
                        <th>Name</th>
                        <th>Customer</th>
                        <th>Location</th>
                        <th>Payment Method</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price(per unit)</th>
                        <th>Total:</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row) => (
                             <tr key={row.id}>
                                 <td >{row.date} </td>
                                     <td>{row.name}</td>
                                     <td >{row.Customer}</td>
                                     <td >{row.Location}</td>
                                     <td >{row.Paymethod}</td>
                                     <td >{row.product}</td>
                                     <td >{row.quan}</td>
                                     <td >{row.price}</td>
                                     <td>{row.total}</td>
                                     </tr>
          ))}
        </tbody>
      </Table>
  );
    }
}

export default Tables
