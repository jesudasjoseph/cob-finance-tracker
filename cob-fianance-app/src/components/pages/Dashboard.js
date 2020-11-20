import React from 'react'
import ProfitProgress from '../Layout/ProfitProgress';
import ExpenseProgress from '../Layout/ExpenseProgress';
import BankProgress from '../Layout/BankProgress';


export default function Dashboard() {
    return (
        <React.Fragment>
            <h1 style={{paddingBottom:'20px', textAlign:'center'}}>Dashboard</h1>
            <h3>Profit Goals</h3>
            <ProfitProgress />
            <h3 style={{padding: '20px 0px'}}>Expenses / Revenue</h3>
            <ExpenseProgress />
            <h3 style={{padding: '20px 0px'}}>Bank / Square Status</h3>
            <BankProgress/>

        </React.Fragment>
    )
}