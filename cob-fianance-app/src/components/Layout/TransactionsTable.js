import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';


function createData(date, name, Customer, Location, Paymethod, product , quan , price, total) {
    return { date, name, Customer, Location, Paymethod, product , quan , price, total};
  }
  const rows =[
    createData('1', 'me1','customer1', 'location1', 'Paymethod1','goods1', 54,100 , 12341234),
    createData('2','me2 ','customer2', 'location2', 'Paymethod2', 'goods2' , 59,100 , 543543)
  ]

export class Tables extends Component {
  constructor(props){
    super(props);
    this.state = {
        date: '',
        name:'', 
        Customer: '',
        Location: ''}
        this.addTransaction = this.addTransaction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
          }
        
          handleChange(event) {
            this.setState({date: event.target.date});
            this.setState({name: event.target.name})
            this.setState({Customer: event.target.Customer})
            this.setState({Location: event.target.Location})
            this.setState({Paymethod: event.target.Paymethod})
            this.setState({product: event.target.product})
            this.setState({quan: event.target.quan})
            this.setState({price: event.target.price})
            this.setState({total: event.target.total})

          }
        
          handleSubmit(event) {
            event.preventDefault();
            this.addTransaction(event)
          }
          addTransaction(event , date, name){
            rows.push(createData(
                this.state.date ,
                this.state.name,
                this.state.Customer,
                this.state.Location,
                this.state.Paymethod,
                this.state.product,
                this.state.quan,
                this.state.price,
                this.state.total))
          }
    render() {
        return (
          <div>
          <form onSubmit={this.handleSubmit}>
                    <label>
                        Date:
                        <input type="text" value={this.state.date}  onChange={(e) => this.setState({date: e.target.value})} />
                    </label>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
                    </label>
                    <label> 
                        Customer:
                        <input type="text" value={this.state.Customer} onChange={(e) => this.setState({Customer: e.target.value})} />
                        
                    </label>
                    <label> 
                        Location:
                        <input type="text" value={this.state.Location} onChange={(e) => this.setState({Location: e.target.value})} />
                        
                    </label>
                    <label> 
                        Pay Method:
                        <input type="text" value={this.state.Paymethod} onChange={(e) => this.setState({Paymethod: e.target.value})} />
                        
                    </label>
                    <label> 
                        Product:
                        <input type="text" value={this.state.product} onChange={(e) => this.setState({product: e.target.value})} />
                        
                    </label>
                    <label> 
                        Price:
                        <input type="text" value={this.state.price} onChange={(e) => this.setState({price: e.target.value})} />
                        
                    </label>
                    <label> 
                        Quantity:
                        <input type="text" value={this.state.quan} onChange={(e) => this.setState({quan: e.target.value})} />
                        
                    </label>
                    <label> 
                        Total:
                        <input type="text" value={this.state.total} onChange={(e) => this.setState({total: e.target.value})} />
                        
                    </label>
                    
                        <input type="submit" value="Submit" />
                        </form>
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
      </div>
  );
    }
}

export default Tables
