import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Link} from 'react-router-dom';

import hamburger from '../../assets/hamburger.png';
import './styles/InstructorNavbar.css';

export default class InstructorNavbar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			smallWindow: false
		}

		this.checkWidth = this.checkWidth.bind(this);
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

	render(){
		if (this.state.smallWindow){
			return (
				<>
					<Navbar fixed="bottom" bg="dark" variant="dark">
						<Navbar.Brand as={Link} to="/instructor/dashboard">
							<img src="/favicon.ico"
								width="30"
								height="30"
								alt="App Logo"
							/>
						</Navbar.Brand>
						<div className="ml-auto dropdown-nav">
							<DropdownButton drop='up' title={<img src={hamburger} width='30' height='30' alt='Nav'></img>} variant="dark" menuAlign="right">
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/instructor/dashboard">Dashboard</Dropdown.Item>
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/instructor/bank">Bank</Dropdown.Item>
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/instructor/usermanagement">Users</Dropdown.Item>
								<Dropdown.Divider/>
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/instructor/database">Database</Dropdown.Item>
								<Dropdown.Divider/>
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/home" onClick={() => {window.localStorage.clear();}}>Logout</Dropdown.Item>
							</DropdownButton>
						</div>
					</Navbar>
				</>
			)
		}
		else {
			return (
				<>
					<Navbar sticky="top" bg="dark" variant="dark">
						<Navbar.Brand as={Link} to="/instructor/dashboard">
							<img src="/favicon.ico"
								width="30"
								height="30"
								alt="App Logo"
							/>
						</Navbar.Brand>
						<div className="ml-auto list-nav">
							<Nav>
								<Nav.Link style={{textAlign: 'center'}} as={Link} to="/instructor/dashboard">Dashboard</Nav.Link>
								<Nav.Link style={{textAlign: 'center'}} as={Link} to="/instructor/bank">Bank</Nav.Link>
								<Nav.Link style={{textAlign: 'center'}} as={Link} to="/instructor/usermanagement">Users</Nav.Link>
							</Nav>
							<DropdownButton style={{textAlign: 'center'}} title={'(' + window.localStorage.getItem('user_id') + ')'} variant="dark" menuAlign="right">
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/instructor/database">Database</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item style={{textAlign: 'center'}} as={Link} to="/home" onClick={() => {window.localStorage.clear();}}>Logout</Dropdown.Item>
							</DropdownButton>
						</div>
					</Navbar>
				</>
			)
		}
	}
}
