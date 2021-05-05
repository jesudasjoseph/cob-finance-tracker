import React, {Component} from 'react';
import {BrowserRouter as Router ,Switch, Route} from 'react-router-dom'

//Insructor Pages/Layouts
import InstructorNavbar from './components/layout/InstructorNavbar';
import DashboardI from './components/pages/instructor/DashboardI';
import UserInstructor from './components/pages/instructor/UserInstructor';
import SettingsInstructor from './components/pages/instructor/SettingsInstuctor';
import UserManagement from './components/pages/instructor/UserManagement';
import SnapshotGroup from './components/pages/instructor/SnapshotGroup.js';
import Bank from './components/pages/instructor/Bank.js';

//Student Pages/Layouts
import StudentNavbar from './components/layout/StudentNavbar';
import Dashboard from './components/pages/student/Dashboard';
import Expenses from './components/pages/student/Expenses';
import Transactions from './components/pages/student/Transactions';
import Page_Settings from './components/pages/student/Settings';

//Common Pages
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Page404 from './components/pages/404';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{
	render(){
		return (
			<Router forceRefresh={false}>
				<Switch>
					<Route exact path="/" component={Home}/>
					<Route path="/home" component={Home}/>
					<Route path="/login" component={Login}/>

					<Route path="/instructor">
						<InstructorNavbar/>
						<div className="container">
							<Switch>
								<Route exact path="/instructor/dashboard" component={DashboardI}/>
								<Route exact path="/instructor/bank" component={Bank}/>
								<Route exact path="/instructor/settings" component={SettingsInstructor} />
								<Route exact path="/instructor/profile" component={UserInstructor} />
								<Route exact path="/instructor/usermanagement" component={UserManagement} />
								<Route exact path="/instructor/dashboard/:id" component={SnapshotGroup}/>
								<Route path="*" component={Page404}/>
							</Switch>
						</div>
					</Route>

					<Route path="/student">
						<StudentNavbar/>
						<div className="container">
							<Switch>
								<Route exact path="/student/dashboard" component={Dashboard}/>
								<Route exact path="/student/settings" component={Page_Settings} />
								<Route exact path="/student/transactions" component={Transactions} />
								<Route exact path="/student/expenses" component={Expenses}/>
								<Route path="*" component={Page404}/>
							</Switch>
						</div>
					</Route>

					<Route path="*" component={Page404}/>
				</Switch>
			</Router>
		);
	}
}

export default App;
