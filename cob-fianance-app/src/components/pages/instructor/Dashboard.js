import React from 'react';
import { withRouter } from 'react-router-dom';
import BusinessTable from '../../layout/BusinessTable';
import AddCompanyDialogButton from '../../layout/AddCompanyDialogButton';

export default class Dashboard extends React.Component {
	render(){
		const BusinessTableWithRouter = withRouter(BusinessTable);
		return (
			<React.Fragment>
				<h1 style={{textAlign:'center'}}> Dashboard </h1>
				<div style={{textAlign: 'right'}}>
					<AddCompanyDialogButton/>
				</div>
				<BusinessTableWithRouter/>
			</React.Fragment>
		)
	}
}
