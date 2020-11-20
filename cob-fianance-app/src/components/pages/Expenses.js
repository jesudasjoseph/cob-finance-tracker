import React from 'react'
import Buttons from '../Layout/ExpensesButtons';
import Table from '../Layout/ExpensesTable';

export default function Expenses() {
    return (
        <React.Fragment>
            <h1 style={{textAlign:'center'}}>Expenses</h1>
            <React.Fragment>
            <div style={{textAlign: 'right'}}>
                <Buttons />
            </div>
            <Table style = {{paddingTop: '10px 20px'}}></Table>
        </React.Fragment>
        </React.Fragment>
    )
}
