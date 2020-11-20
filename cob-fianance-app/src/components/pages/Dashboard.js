import React from 'react'
import ProfitProgress from '../Layout/ProfitProgress';
import ExpenseProgress from '../Layout/ExpenseProgress';
import BankProgress from '../Layout/BankProgress';


export default function Dashboard() {
    return (
        <React.Fragment>
            <h1>Dashboard</h1>
            <p>Profit Goals</p>
            <ProfitProgress />
            <p style={{padding: '20px 0px'}}>Expenses / Revenue</p>
            <ExpenseProgress />
            <p style={{padding: '20px 0px'}}>Bank / Square Status</p>
            <BankProgress/>

        </React.Fragment>
    )
}