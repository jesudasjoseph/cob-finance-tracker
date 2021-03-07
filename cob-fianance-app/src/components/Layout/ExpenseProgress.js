import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
const now = 30;
var resProfit = ''
var resExpense = ''
var a = 0
var b = 0 
var c = 0 
var d =0 
var goal = 100
var resRevenue='' 
export class ExpenseProgress extends Component {
    constructor(props){
        super(props);
        this.state = {
          name: '',
          section:'', 
          deposit_total: '',
          expense_total: '',
          transaction_total: '',
          transaction_count:'',
          expense_count:'',
          profit:'',
            profitbar: '',
            expensesbar: '',
            revenuebar:'',
            businessTable: []
          , expenses:[]}
            this.get_business = this.get_business.bind(this);
            this.get_business();
            this.state.betternow = this.deposit_total;
              }
      get_business(){
        fetch('http://' + '71.193.191.23' + ':2021/business/byuid', {
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
          this.setState({expenses:data});
        }).catch((error) => {
          console.error('Error:', error);
        });
      }
    render() {
        {this.state.expenses.map((expense, index) => {
            const {deposit_count,deposit_total,expense_count,expense_total, name, product_count, profit,transaction_total,transaction_count} = expense;
            this.state.profitbar = profit
            this.state.expensesbar = expense_total
            this.state.revenuebar = transaction_total
            var str = this.state.revenuebar
            var str2 = this.state.expensesbar
            resExpense = str2.split("$");
            resRevenue = str.split("$");
            a = parseFloat(resRevenue[1]);
            b = parseFloat(resExpense[1]);
            console.log(a)
            
            return (
              <div>{expense_total}</div>
            )
            })}
        return(
        <div> 
            <ProgressBar  style= {{height:'50px'}} variant="danger" now={100*b/goal} label={`Expenses: $${b}`} />
            <ProgressBar style= {{height:'50px'}} variant="success" now={100*a/goal} label={`Revenue: $${a}`}/>
        </div>
        )
    }
}

export default ExpenseProgress
