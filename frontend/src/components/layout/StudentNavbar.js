import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Link, withRouter} from 'react-router-dom';

import { AppContext } from '../../AppContext';

import hamburger from '../../assets/hamburger.png';
import './styles/StudentNavbar.css';

class StudentNavbar extends Component {

	constructor(props){
		super(props);

		this.state = {
			smallWindow: false
		}

		this.checkWidth = this.checkWidth.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	checkWidth(){
		const match = window.matchMedia(`(max-width: 768px)`);
		this.setState({smallWindow: match.matches});
	}

	componentDidMount() {
		this.checkWidth();
		window.addEventListener("resize", this.checkWidth);
	}
	componentWillUnmount() {
 		window.removeEventListener("resize", this.checkWidth);
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
		if (this.state.smallWindow) {
			return(
				<Navbar fixed="bottom" collapseOnSelect expand="md" bg="dark" variant="dark">
					<Navbar.Brand as={Link} to="/student/dashboard">College of Buisness App</Navbar.Brand>
					<div className='ml-auto'>
						<DropdownButton variant="dark" drop='up' menuAlign="right" title={<img src={hamburger} alt='Nav'></img>} id="collasible-nav-dropdown">
							<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/student/dashboard">Dashboard</Dropdown.Item>
							<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/student/transactions">Transactions</Dropdown.Item>
							<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/student/expenses">Expenses</Dropdown.Item>
							<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/student/settings">Settings</Dropdown.Item>
							<Dropdown.Divider/>
							<Dropdown.Item style={{textAlign: 'center'}} onClick={this.onLogout}>Logout</Dropdown.Item>
						</DropdownButton>
					</div>
				</Navbar>
			);
		}
		else {
			return(
				<Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark">
					<Navbar.Brand as={Link} to="/student/dashboard">College of Buisness App</Navbar.Brand>
					<div className='ml-auto list-nav'>
						<Nav>
							<Nav.Link style={{textAlign: 'center'}} as={Link} to="/student/dashboard">Dashboard</Nav.Link>
							<Nav.Link style={{textAlign: 'center'}} as={Link} to="/student/transactions">Transactions</Nav.Link>
							<Nav.Link style={{textAlign: 'center'}} as={Link} to="/student/expenses">Expenses</Nav.Link>
						</Nav>
						<Nav>
							<DropdownButton variant="dark" menuAlign="right" title={window.localStorage.getItem('user_id')} id="collasible-nav-dropdown">
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/student/settings">Settings</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item style={{textAlign: 'center'}} onClick={this.onLogout}>Logout</Dropdown.Item>
							</DropdownButton>
						</Nav>
					</div>
				</Navbar>
			);
		}
	}
}
StudentNavbar.contextType = AppContext;
export default withRouter(StudentNavbar);

