import React from 'react'
import Buttons from '../Layout/ExpensesButtons';
import Table from '../Layout/ExpensesTable';
import Navbar from '../Layout/MyNavbar';
export default function Expenses() {
    return (
        <React.Fragment>
             <Navbar></Navbar>
            <h1 style={{textAlign:'center'}}>Expenses</h1>
            <React.Fragment>
            <Table style = {{paddingTop: '10px 20px' }}></Table>
        </React.Fragment>
        </React.Fragment>
    )
}
