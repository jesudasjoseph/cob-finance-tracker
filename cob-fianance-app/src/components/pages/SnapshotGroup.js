import React from 'react'
import ProfitProgress from '../Layout/ProfitProgress';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ExpenseProgress from '../Layout/ExpenseProgress';
import TransactionsTable from '../Layout/TransactionsTable';
import Expenses from '../Layout/ExpensesTable';
import BankProgress from '../Layout/BankProgress';
import NavibarI from '../Layout/MyNavBarI';
import Searchbar from '../Layout/SearchBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//let fetch = require("fetch");
//
//<React.Fragment>
//  <Expenses style = {{padding: '10px 20px'}}></Expenses>
//</React.Fragment>

export default class DashboardI extends React.Component{

render () {
  const handleexpensetable = () => {
    <React.Fragment>
      <Expenses style = {{padding: '10px 20px'}}></Expenses>
    </React.Fragment>
  }
    return (
      <React.Fragment>
      <NavibarI/>
          <h1 style={{textAlign:'center'}}> Group Name </h1>
          <div style={{textAlign: 'right'}}>
          </div>
          <h2>Profit Goals</h2>
          <ProfitProgress />
          <h3 style={{padding: '20px 0px'}}>Expenses / Revenue</h3>
          <ExpenseProgress />
          <h3 style={{padding: '20px 0px'}}>Bank / Square Status</h3>
          <BankProgress/>
          <Button onClick={() => handleexpensetable()}> Get Expense Table </Button>
      </React.Fragment>
  )
  }
}
