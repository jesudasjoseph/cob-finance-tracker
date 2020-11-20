
import React from 'react'
import Buttons from '../Layout/Buttons';

export default function Transactions() {
    return (
        <React.Fragment>
            <h1>Transactions</h1>
            <p>This is the COB finance app transactions page</p>
            <div style={{textAlign: 'right'}}>
                <Buttons />
            </div>
        </React.Fragment>
    )
}

const ButtonStyle = {
    flex: '1',
    background: '#add8e6',
    color: '#333',
    textAlign: 'center',
    //padding: '25px , 200px',
    justifyContent: 'center',
    alignItems: 'center',
    size:'lg',
    width:'700px',
    display: 'inline-block',
    height: '100px'
}