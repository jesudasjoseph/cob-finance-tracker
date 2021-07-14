
import React from 'react'
import TransactionsTable from '../../layout/TransactionsTable';

export default function Transactions() {
	return (
		<>
			<h1 style={{textAlign:'center'}}>Transactions</h1>
			<div style={{textAlign: 'right', margin: '5px'}}>
			</div>
			<TransactionsTable style = {{paddingTop: '10px 20px'}}/>
		</>
	)
}
