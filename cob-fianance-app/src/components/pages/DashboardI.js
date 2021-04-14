import React from 'react'
import GroupTable from '../Layout/GroupTable';
import NavibarI from '../Layout/MyNavBarI';
import AddBusinessDialogButton from '../Layout/AddBusinessDialogButton';

export default function DashboardI() {
	return (
		<React.Fragment>
			<NavibarI/>
			<h1 style={{textAlign:'center'}}> Dashboard </h1>
			<div style={{textAlign: 'right'}}>
				<AddBusinessDialogButton/>
			</div>
			<GroupTable/>
		</React.Fragment>
	)
}
