import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';

export class Tables extends Component {
	constructor(props){
		super(props);
		this.state = {
			customer: '',
			date:'',
			product: '',
			payment_method: '',
			quantity: '',
			price_per_unit:'',
			total:'',
			transactionTable: []
		}
		this.get_transactions = this.get_transactions.bind(this);
		this.get_transactions();
		this.add_transactions =this.add_transactions.bind(this);
		this.add_transactions();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
          handleSubmit(event) {
            event.preventDefault();
            this.add_transactions(event)
            this.get_transactions(event)
          }
          get_transactions(){
            fetch('http://71.193.191.23:2021/transaction/byuid?start=0&end=50', {
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
              this.setState({transactionTable:data});
            }).catch((error) => {
              console.error('Error:', error);
            });
          }
          add_transactions(){
            let body ={transaction:{
              customer: this.state.customer,
              date:this.state.date,
              product: this.state.product ,
              payment_method: this.state.payment_method,
              quantity:this.state.quantity,
              price_per_unit:this.state.price_per_unit
              }
            }
            console.log(body)
            fetch('http://71.193.191.23:2021/transaction', {
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
                        Customer:
                        <input type="text" value={this.state.customer}  onChange={(e) => this.setState({customer: e.target.value})} />
                    </label>
                    <label>
                        Date:
                        <input type="text" value={this.state.date} onChange={(e) => this.setState({date: e.target.value})} />
                    </label>
                    <label>
                        product:
                        <input type="text" value={this.state.product} onChange={(e) => this.setState({product: e.target.value})} />

                    </label>
                    <label>
                        Payment Method:
                        <input type="text" value={this.state.payment_method} onChange={(e) => this.setState({payment_method: e.target.value})} />

                    </label>
                    <label>
                        Quantity:
                        <input type="text" value={this.state.quantity} onChange={(e) => this.setState({quantity: e.target.value})} />

                    </label>
                    <label>
                        Price per unit:
                        <input type="text" value={this.state.price_per_unit} onChange={(e) => this.setState({price_per_unit: e.target.value})} />

                    </label>
                        <input type="submit" value="Submit" />
                        </form>

          <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
              <thead>
                  <tr>
                      <th>customer</th>
                      <th>date</th>
                      <th>product</th>
                      <th>Payment Method</th>
                      <th>Quantity</th>
                      <th>Price Per Unit</th>
                      <th>Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.transactionTable.map((transaction, index) => {
                         const {customer,date,product,payment_method, quantity, price_per_unit, tid, total} = transaction;
                         return (
                           <tr key={tid}>
                               <td> {customer}</td>
                               <td> {date.split('T')[0]} </td>
                               <td>{product}</td>
                               <td> {payment_method} </td>
                               <td> {quantity} </td>
                               <td> {price_per_unit} </td>
                               <td> {total} </td>
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
