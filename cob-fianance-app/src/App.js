import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

//Insructor Pages/Layouts
import InstructorNavbar from './components/layout/InstructorNavbar';
import CompanyManagementPage from './components/pages/instructor/CompanyManagementPage';
import DatabaseManagementPage from './components/pages/instructor/DatabaseManagementPage';
import UserManagement from './components/pages/instructor/UserManagement';
import SnapshotGroup from './components/pages/instructor/SnapshotGroup.js';
import Bank from './components/pages/instructor/Bank.js';

//Student Pages/Layouts
import StudentNavbar from './components/layout/StudentNavbar';
import Dashboard from './components/pages/student/Dashboard';
import ExpensePage from './components/pages/student/ExpensePage';
import TransactionPage from './components/pages/student/TransactionPage';
import Page_Settings from './components/pages/student/Settings';

//Common Pages
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Page404 from './components/pages/404';

//Notification
import Notification from './components/layout/Notification';

//Context
import { AppContext } from './AppContext';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			showNotification: false,
			notificationType: '',
			notificationTitle: '',
			notificationContent: '',
			notificationTimeout: 0
		}

		this.pushNotification = this.pushNotification.bind(this);
		this.notificationOnClose = this.notificationOnClose.bind(this);
	}

	pushNotification(type, title, content, timeout){
		this.setState({notificationType: type, notificationTitle: title, notificationContent: content, notificationTimeout: timeout, showNotification:true});
	}

	notificationOnClose(){
		this.setState({showNotification: false});
	}

	render(){
		return (
			<>
				<AppContext.Provider value={{pushNotification: this.pushNotification}}>
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route path="/home" component={Home}/>
							<Route path="/login" component={Login}/>
							<Route path="/404" component={Page404}/>

							<Route path="/instructor">
								<InstructorNavbar/>
								<div className="container">
									<Switch>
										<Route exact path="/instructor/dashboard" component={CompanyManagementPage}/>
										<Route exact path="/instructor/companymanagementpage" component={CompanyManagementPage}/>
										<Route exact path="/instructor/bank" component={Bank}/>
										<Route exact path="/instructor/usermanagement" component={UserManagement}/>
										<Route exact path="/instructor/database" component={DatabaseManagementPage}/>
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
										<Route exact path="/student/transactions" component={TransactionPage} />
										<Route exact path="/student/expenses" component={ExpensePage}/>
										<Route path="*" component={Page404}/>
									</Switch>
								</div>
							</Route>

							<Route path="*" component={Page404}/>
						</Switch>
					</BrowserRouter>
				</AppContext.Provider>

				<Notification show={this.state.showNotification} type={this.state.notificationType} content={this.state.notificationContent} title={this.state.notificationTitle} onClose={this.notificationOnClose} timeout={this.state.notificationTimeout}/>
			</>
		);
	}
}
