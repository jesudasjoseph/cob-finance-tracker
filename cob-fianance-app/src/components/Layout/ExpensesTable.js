import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { API_PATH } from '../Config';

export class ExpensesTables extends Component {
    constructor(props){
        super(props);
        this.state = {
          quantity: '',
          product:'',
          company: '',
          date: '',
          payment_method: '',
          price_per_unit:'',
          justification:'',
          total:'',
          expensesTable: []
        }
            this.get_expenses = this.get_expenses.bind(this);
            this.get_expenses();
            this.add_expenses = this.add_expenses.bind(this);
            this.add_expenses();
            this.handleSubmit = this.handleSubmit.bind(this);
              }
              get_expenses(){
                fetch(API_PATH + '/expense/byuid?start=' + '0' + '&end=' + '50', {
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
                  this.setState({expensesTable:data});
                }).catch((error) => {
                  console.error('Error:', error);
                });
              }
              handleSubmit(event) {
                event.preventDefault();
                this.add_expenses(event)
                this.get_expenses(event)
              }
              add_expenses(){
                let body ={expense:{
                  quantity: this.state.quantity,
                  product:this.state.product,
                  date:this.state.date,
                  company: this.state.company ,
                  payment_method: this.state.payment_method,
                  price_per_unit:this.state.price_per_unit,
                  justification:this.state.justification
                  }
                }
                console.log(body)
                fetch(API_PATH + '/expense', {
                  mode: 'cors',
                  method: 'POST',
                  credentials: 'same-origin',
                  headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': window.localStorage.getItem('jwt')
                  },
                  body: JSON.stringify(body)
                }).then(response => {
                  console.log(response);
                  return response.json();
                }).catch((error) => {
                  console.error('Error:', error);
                });
              }
              render() {
                  return (
            <div>
               <form onSubmit={this.handleSubmit}>
                    <label>
                        Quantity:
                        <input type="text" value={this.state.quantity}  onChange={(e) => this.setState({quantity: e.target.value})} />
                    </label>
                    <label>
                        Product:
                        <input type="text" value={this.state.product} onChange={(e) => this.setState({product: e.target.value})} />
                    </label>
                    <label>
                        Company:
                        <input type="text" value={this.state.company} onChange={(e) => this.setState({company: e.target.value})} />

                    </label>
                    <label>
                        Date:
                        <input type="text" value={this.state.date} onChange={(e) => this.setState({date: e.target.value})} />

                    </label>
                    <label>
                        Payment Method:
                        <input type="text" value={this.state.payment_method} onChange={(e) => this.setState({payment_method: e.target.value})} />

                    </label>
                    <label>
                        Price Per Unit:
                        <input type="text" value={this.state.price_per_unit} onChange={(e) => this.setState({price_per_unit: e.target.value})} />

                    </label>
                    <label>
                        Justification:
                        <input type="text" value={this.justification} onChange={(e) => this.setState({justification: e.target.value})} />

                    </label>
                        <input type="submit" value="Submit" />
                        </form>
          <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
              <thead>
                  <tr>
                      <th>Quantity</th>
                      <th>Product</th>
                      <th>Company</th>
                      <th>Date</th>
                      <th>Payment Method</th>
                      <th>Price Per Unit</th>
                      <th>Justification</th>
                      <th>Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.expensesTable.map((expense, index) => {
                         const {quantity,product,company, date, payment_method, price_per_unit, justification, total,eid} = expense;
                         return (
                           <tr key={eid}>
                               <td> {quantity}</td>
                               <td> {product} </td>
                               <td>{company}</td>
                               <td> {date.split('T')[0]} </td>
                               <td> {payment_method} </td>
                               <td> {price_per_unit} </td>
                               <td> {justification} </td>
                               <td> {total} </td>
                           </tr>
                         )
                         })}
                     </tbody>
           </Table>
    </div>
        )
    }
}

export default ExpensesTables
