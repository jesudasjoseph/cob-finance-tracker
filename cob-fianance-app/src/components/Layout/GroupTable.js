import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import ProfitProgress from '../Layout/ProfitProgress';


export class Tables extends Component {
  constructor(props){
    super(props);
    this.state = {
        gname: '',
        Instructor:'',
        Revenue: '',
        Bank: '',
        businessTable: []}
        this.get_businesses = this.get_businesses.bind(this);
        this.get_businesses();
          }


          get_businesses(){
            fetch('http://' + '71.193.191.23' + ':2021/business?start=' + '0' + '&end=' + '50', {
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
              this.setState({businessTable:data});
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
                       <th>Instructor</th>
                       <th>Revenue</th>
                       <th>Bank</th>
                       <th>Square</th>
                       <th> Quantity Sold </th>
                       <th>Expenses</th>
                       <th>Profits</th>
                       <th>Sales Goals</th>
                       </tr>
                       </thead>
                       <tbody>
                       {this.state.businessTable.map((business, index) => {
                          const {name,deposit_total,product_count,expense_total, bid, profit} = business;
                          return (
                            <tr key={bid}>
                                <td> <a href="/GroupFinancials"> {name} </a> </td>
                                <td> Instructor </td>
                                <td> {deposit_total} </td>
                                <td> Bank Money </td>
                                <td> Square Money </td>
                                <td> {product_count} </td>
                                <td> {expense_total} </td>
                                <td> {profit} </td>
                                <td><ProfitProgress /></td>
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
