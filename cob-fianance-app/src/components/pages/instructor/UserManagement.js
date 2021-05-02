import React from 'react'
import Buttons from '../../layout/UserMButtons';
import Table from '../../layout/UserMTable';

export default function StudentUsers() {
	return (
		<React.Fragment>
			<h1 style={{textAlign:'center'}}>User Management</h1>
			<div style={{textAlign: 'right'}}>
				<Buttons />
			</div>
			<Table style = {{paddingTop: '10px 20px'}}></Table>
		</React.Fragment>
	)
}
