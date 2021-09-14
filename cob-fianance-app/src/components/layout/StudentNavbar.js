import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link, withRouter} from 'react-router-dom';

import { AppContext } from '../../AppContext';

class StudentNavbar extends Component {

	constructor(props){
		super(props);

		this.onLogout = this.onLogout.bind(this);
	}

	onLogout(){
		if (window.localStorage.getItem('jwt_admin') != null) {
			window.localStorage.setItem('jwt', window.localStorage.getItem('jwt_admin'));
			window.localStorage.setItem('role', window.localStorage.getItem('role_admin'));
			window.localStorage.setItem('user_id', window.localStorage.getItem('user_id_admin'));

			window.localStorage.removeItem('jwt_admin');
			window.localStorage.removeItem('role_admin');
			window.localStorage.removeItem('user_id_admin');

			this.context.setLoginState(false);

			this.props.history.push('/instructor/usermanagement');
		}
		else {
			window.localStorage.clear();
			this.props.history.push('/home');
		}
	}

	render(){
		return(
			<Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Brand as={Link} to="/student/dashboard">College of Buisness App</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
						<Nav.Link as={Link} to="/student/transactions">Transactions</Nav.Link>
						<Nav.Link as={Link} to="/student/expenses">Expenses</Nav.Link>
					</Nav>
					<Nav>
						<NavDropdown title="User Profile" id="collasible-nav-dropdown">
							<NavDropdown.Item as={Link} to="/student/settings">Settings</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item onClick={this.onLogout}>Logout</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}
StudentNavbar.contextType = AppContext;
export default withRouter(StudentNavbar);

