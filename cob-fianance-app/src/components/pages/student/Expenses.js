import React from 'react';
import ExpenseTable from '../../layout/ExpenseTable';
import AddExpenseDialogButton from '../../layout/AddExpenseDialogButton';

export default function Expenses() {
	return (
		<>
			<h1 style={{textAlign:'center'}}>Expenses</h1>
			<div style={{textAlign: 'right', margin: '5px'}}>
				<AddExpenseDialogButton/>
			</div>
			<ExpenseTable style = {{paddingTop: '10px 20px' }}></ExpenseTable>
		</>
	)
}
