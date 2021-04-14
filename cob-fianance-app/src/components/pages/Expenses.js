import React from 'react';
import Navbar from '../Layout/MyNavbar';
import Table from '../Layout/ExpensesTable';

export default function Expenses() {
	return (
		<>
			<Navbar/>
			<h1 style={{textAlign:'center'}}>Expenses</h1>
			<Table style = {{paddingTop: '10px 20px' }}></Table>
		</>
	)
}
