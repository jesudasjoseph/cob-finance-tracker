
import React from 'react'
import Buttons from '../Layout/Buttons';
import Table from '../Layout/Table';

export default function Transactions() {
    return (
        <React.Fragment>
            <h1>Transactions</h1>
            <div style={{textAlign: 'right'}}>
                <Buttons />
            </div>
            <Table style = {{paddingTop: '10px 20px'}}></Table>
        </React.Fragment>
    )
}
