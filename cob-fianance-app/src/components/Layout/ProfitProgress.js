import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';


const now = 30;
var resProfit = ''
var resExpense
var a = 0
var b = 0 
var c = 0 
var d =0 
var goal = 100
//const progressInstance = <ProgressBar now={now} label={`${now}%`} />;

export class ProfitProgress extends Component {
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
       //const {customer,date,product,payment_method, quantity, price_per_unit, tid, total} = business;
       {this.state.expenses.map((expense, index) => {
        const {deposit_count,deposit_total,expense_count,expense_total, name, product_count, profit} = expense;
        this.state.profitbar = profit
        this.state.expensesbar = expense_total
        var str = this.state.profitbar
        var str2 = this.state.expensesbar
        resProfit = str.split("$");
        resExpense = str2.split("$");
        a = parseFloat(resProfit[1]);
        b = parseFloat(resExpense[1]);
        console.log(a)

        if(now<25)
        return (
          <div>{expense_total}</div>
        )
        })}
        if(a<25){
        return (
            <ProgressBar style= {{height:'50px'}} now={100*a/goal} variant="danger" label={`${100*a/goal}%`} />
        )
        }
        if(a>25 && a<100){
            return (
                <ProgressBar style= {{height:'50px'}} now={100*a/goal} variant="warning" label={`${a}%`} />
                )
            }
        if(a>=100){
            return (
            <ProgressBar style= {{height:'50px'}} now={100*a/goal} variant="success" label={`GOAL REACHED: ${100*a/goal}%`} />
            )
        }
    }
}


export default ProfitProgress
