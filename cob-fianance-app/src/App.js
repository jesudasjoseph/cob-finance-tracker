import React, {Component} from 'react';
import {BrowserRouter as Router ,Switch, Route} from 'react-router-dom'

import Dashboard from './components/pages/Dashboard';
import DashboardI from './components/pages/DashboardI';
import InstructorNavbar from './components/Layout/InstructorNavbar';
import UserInstructor from './components/pages/UserInstructor';
import SettingsInstructor from './components/pages/SettingsInstuctor';
import UserManagement from './components/pages/UserManagement';
import SnapshotGroup from './components/pages/SnapshotGroup.js';
import Expenses from './components/pages/Expenses';
import Transactions from './components/pages/Transactions';
import Login from './components/pages/Login';
import Page_Settings from './components/pages/Settings';
import Page404 from './components/pages/404';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{
	state = {
		todos: []
	}
	render(){
		return (
			<Router forceRefresh={false}>
				<div>
					<Switch>
						<Route exact path="/" component={Login} />
						<Route path="/home" component={Login} />

						<Route path="/instructor">
							<InstructorNavbar/>
							<Switch>
								<Route exact path="/instructor/dashboard" component={DashboardI}/>
								<Route exact path="/instructor/settings" component={SettingsInstructor} />
								<Route exact path="/instructor/usermanagement" component={UserManagement} />
								<Route exact path="/instructor/dashboard/:id" component={SnapshotGroup}/>
								<Route path="*" component={Page404}/>
							</Switch>
						</Route>

						<Route path= "/Profile" component={UserInstructor} />
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/transactions" component={Transactions} />
						<Route path="/expenses" component={Expenses} />
						<Route path="/settings" component={Page_Settings}/>
						<Route path="*" component={Page404}/>
						</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
