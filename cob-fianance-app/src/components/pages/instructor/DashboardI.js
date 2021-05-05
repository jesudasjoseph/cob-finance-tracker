import React from 'react'
import BusinessTable from '../../layout/BusinessTable';
import AddBusinessDialogButton from '../../layout/AddBusinessDialogButton';

export default function DashboardI() {
	return (
		<React.Fragment>

			<h1 style={{textAlign:'center'}}> Dashboard </h1>
			<div style={{textAlign: 'right'}}>
				<AddBusinessDialogButton/>
			</div>
			<BusinessTable/>
		</React.Fragment>
	)
}
