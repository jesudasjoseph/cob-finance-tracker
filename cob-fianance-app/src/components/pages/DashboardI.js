import React from 'react'
import GroupTable from '../Layout/GroupTable';
import NavibarI from '../Layout/MyNavBarI';

export default function DashboardI() {
	return (
		<React.Fragment>
			<NavibarI/>
			<h1 style={{textAlign:'center'}}> Dashboard </h1>
			<GroupTable/>
		</React.Fragment>
	)
}
