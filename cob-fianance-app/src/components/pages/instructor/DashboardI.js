import React from 'react'
import BusinessTable from '../../Layout/BusinessTable';
import AddBusinessDialogButton from '../../Layout/AddBusinessDialogButton';

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
