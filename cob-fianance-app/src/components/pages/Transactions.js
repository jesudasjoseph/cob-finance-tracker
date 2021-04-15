
import React from 'react'
import Buttons from '../Layout/TransactionsButtons';
import Table from '../Layout/TransactionsTable';
import Navbar from '../Layout/MyNavbar';

export default function Transactions() {
    return (
        <React.Fragment>
            <Navbar></Navbar>
            <h1 style={{textAlign:'center'}}>Transactions</h1>
            <div style={{textAlign: 'right'}}>
                <Buttons />
            </div>
            <Table style = {{paddingTop: '10px 20px'}}></Table>
        </React.Fragment>
    )
}


