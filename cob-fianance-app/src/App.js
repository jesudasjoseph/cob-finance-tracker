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
import Toast from 'react-bootstrap/Toast';

//Context
import { AppContext } from './AppContext';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function NotificationObj(title, content, type, delay){
	this.title = title;
	this.content = content;
	this.type = type;
	this.delay = delay;
	this.show = true;
}

export default class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			notificationPool: [],
			notificationHiddenPoolCount: 0,
			showNotification: false,
			notificationType: '',
			notificationTitle: '',
			notificationContent: '',
			notificationTimeout: 0
		}

		this.pushNotification = this.pushNotification.bind(this);
		this.notificationOnClose = this.notificationOnClose.bind(this);
	}

	//Push notifiaction onto notifiaction state array. Replace notifiactions that are already invisible.
	pushNotification(type, title, content, delay_in_seconds){
		if (this.state.notificationPool.length === 0){
			this.setState({notificationPool: [new NotificationObj(title, content, type, delay_in_seconds * 1000)]});
		}
		else if (this.state.notificationHiddenPoolCount > 0){
			for (let i = 0; i < this.state.notificationPool.length; i++){
				if (!this.state.notificationPool[i].show){
					let tempNotificationPool = this.state.notificationPool;
					tempNotificationPool[i] = new NotificationObj(title, content, type, delay_in_seconds * 1000);
					this.setState({notificationPool: tempNotificationPool, notificationHiddenPoolCount: this.state.notificationHiddenPoolCount - 1});
					break;
				}
			}
		}
		else {
			let tempNotificationPool = this.state.notificationPool;
			tempNotificationPool.push(new NotificationObj(title, content, type, delay_in_seconds * 1000));
			this.setState({notificationPool: tempNotificationPool});
		}
	}

	notificationOnClose(index){
		let notificationPool = this.state.notificationPool;
		notificationPool[index].show = false;
		this.setState({notificationPool: notificationPool, notificationHiddenPoolCount: this.state.notificationHiddenPoolCount + 1});
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

				<div className='toast-container'>
					{
						this.state.notificationPool.map((notification, index) => {
							const { title, content, type, delay, show} = notification;
							return(
								<Toast className='toast' onClose={() => this.notificationOnClose(index)} show={show} delay={delay} autohide={delay}>
									<Toast.Header>
										<img
											src="holder.js/20x20?text=%20"
											className="rounded me-2"
											alt=""
										/>
										<strong className="mr-auto">{title}</strong>
									</Toast.Header>
									<Toast.Body>{content}</Toast.Body>
								</Toast>
							);
						})
					}
				</div>

			</>
		);
	}
}
