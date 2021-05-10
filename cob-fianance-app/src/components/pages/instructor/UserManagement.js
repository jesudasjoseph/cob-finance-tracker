import React from 'react';
import Table from '../../layout/UserMTable';

export default function StudentUsers() {
	return (
		<React.Fragment>
			<h1 style={{textAlign:'center'}}>User Management</h1>
			<Table style = {{paddingTop: '10px 20px'}}/>
		</React.Fragment>
	)
}
