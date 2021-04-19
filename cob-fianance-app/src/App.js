import React, {Component} from 'react';
import {BrowserRouter as Router ,Switch, Route} from 'react-router-dom'
import Dashboard from './components/pages/Dashboard';
import DashboardI from './components/pages/DashboardI';
import UserInstructor from './components/pages/UserInstructor';
import SettingsInstructor from './components/pages/SettingsInstuctor';
import UserManagement from './components/pages/UserManagement';
import SnapshotGroup from './components/pages/SnapshotGroup.js';
import Expenses from './components/pages/Expenses';
import Transactions from './components/pages/Transactions';
import Login from './components/pages/Login';
import Page_Settings from './components/pages/Settings';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{
	state = {
		todos: []
	}
	render(){
		return (
			<Router>
				<div className="App" style={{background: '#d3d3d3', backgroundSize: 'cover',   width: '100%' , height: '100vh' , minHeight: '100%' }}>
					<div className="container">
					<Switch>
						<Route path="/DashboardI" component={DashboardI} />
						<Route path= "/Profile" component={UserInstructor} />
						<Route exact path= "/SettingsInstuctor" component={SettingsInstructor} />
						<Route exact path="/UserManagement" component={UserManagement} />
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/transactions" component={Transactions} />
						<Route path="/expenses" component={Expenses} />
						<Route path="/settings" component={Page_Settings}/>
						<Route exact path= "/:int" component={SnapshotGroup} />
						<Route path="*">{<Redirect to="/login">}</Route>
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
