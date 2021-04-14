import React from 'react'
import Navibar from '../Layout/MyNavbar';
import ProfitGoalsForm from '../Layout/ProfitGoalsForm';

export default function Settings() {
	return (
		<React.Fragment>
			<Navibar/>
			<h1 style={{textAlign:'center'}}>Settings</h1>
			<ProfitGoalsForm/>
		</React.Fragment>
	)
}
