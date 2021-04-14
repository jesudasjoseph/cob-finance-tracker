import React from 'react';
import Navbar from '../Layout/MyNavbar';
import Table from '../Layout/ExpensesTable';
import AddExpenseDialogButton from '../Layout/AddExpenseDialogButton';

export default function Expenses() {
	return (
		<>
			<Navbar/>
			<h1 style={{textAlign:'center'}}>Expenses</h1>
			<div style={{textAlign: 'right', margin: '5px'}}>
				<AddExpenseDialogButton/>
			</div>
			<Table style = {{paddingTop: '10px 20px' }}></Table>
		</>
	)
}
