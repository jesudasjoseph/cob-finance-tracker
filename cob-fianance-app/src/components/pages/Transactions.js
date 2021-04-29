
import React from 'react'
import TransactionsTable from '../Layout/TransactionsTable';
import AddTransactionDialogButton from '../Layout/AddTransactionDialogButton';

export default function Transactions() {
	return (
		<>
			<div className="container">
				<h1 style={{textAlign:'center'}}>Transactions</h1>
				<div style={{textAlign: 'right', margin: '5px'}}>
					<AddTransactionDialogButton/>
				</div>
				<TransactionsTable style = {{paddingTop: '10px 20px'}}/>
			</div>
		</>
	)
}
