import React, {Component} from 'react';
import {BrowserRouter as Router ,Switch, Route} from 'react-router-dom'


import InstructorNavbar from './components/Layout/InstructorNavbar';
import DashboardI from './components/pages/instructor/DashboardI';
import UserInstructor from './components/pages/instructor/UserInstructor';
import SettingsInstructor from './components/pages/instructor/SettingsInstuctor';
import UserManagement from './components/pages/instructor/UserManagement';
import SnapshotGroup from './components/pages/instructor/SnapshotGroup.js';

import StudentNavbar from './components/Layout/StudentNavbar';
import Dashboard from './components/pages/student/Dashboard';
import Expenses from './components/pages/student/Expenses';
import Transactions from './components/pages/student/Transactions';
import Page_Settings from './components/pages/student/Settings';

import Login from './components/pages/Login';
import Page404 from './components/pages/404';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{
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
								<Route exact path="/instructor/profile" component={UserInstructor} />
								<Route exact path="/instructor/usermanagement" component={UserManagement} />
								<Route exact path="/instructor/dashboard/:id" component={SnapshotGroup}/>
								<Route path="*" component={Page404}/>
							</Switch>
						</Route>

						<Route path="/student">
							<StudentNavbar/>
							<Switch>
								<Route exact path="/student/dashboard" component={Dashboard}/>
								<Route exact path="/student/settings" component={Page_Settings} />
								<Route exact path="/student/transactions" component={Transactions} />
								<Route exact path="/student/expenses" component={Expenses}/>
								<Route path="*" component={Page404}/>
							</Switch>
						</Route>

						<Route path="*" component={Page404}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
