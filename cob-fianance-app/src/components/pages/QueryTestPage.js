//Page for test http requests
//Temporary and should be removed from build!

import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

let ip = '71.193.191.23';
//let ip = 'localhost';

export default class QueryTestPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			button0Text: "Get Token for 'student'",
			button1Text: "Get Token for 'instructor'",
			button2Text: "Get Token for 'admin'",
			button3Text: "Get Business data 0-50",
			button4Text: "Text",
			button5Text: "Text",
			uid: "",
			token: null,
			userTable: [],
			businessTable: [],
			transactionTable: []
		};

		this.getTokenStudent = this.getTokenStudent.bind(this);
		this.getTokenInstructor = this.getTokenInstructor.bind(this);
		this.getTokenAdmin = this.getTokenAdmin.bind(this);

		this.handleIndexChange = this.handleIndexChange.bind(this);
		this.handleRowsChange = this.handleRowsChange.bind(this);
		this.handleBidChange = this.handleBidChange.bind(this);

		this.handleFirstChange = this.handleFirstChange.bind(this);
		this.handleLastChange = this.handleLastChange.bind(this);
		this.handleRoleChange = this.handleRoleChange.bind(this);
		this.handleUidChange = this.handleUidChange.bind(this);
		this.handleAddUserClick = this.handleAddUserClick.bind(this);
		this.handleGetUserClick = this.handleGetUserClick.bind(this);
		this.handleGetMultipleUsersClick = this.handleGetMultipleUsersClick.bind(this);
		this.handleModifyUserClick = this.handleModifyUserClick.bind(this);
		this.handleDeleteUserClick = this.handleDeleteUserClick.bind(this);

		this.handleGetMultipleBusinessClick = this.handleGetMultipleBusinessClick.bind(this);
		this.handleAddBusinessClick = this.handleAddBusinessClick.bind(this);
		this.handleBusinessSecChange = this.handleBusinessSecChange.bind(this);
		this.handleBusinessNameChange = this.handleBusinessNameChange.bind(this);

		this.handleGetMultipleTransactionsClick = this.handleGetMultipleTransactionsClick.bind(this);

		this.handleTransactionUid = this.handleTransactionUid.bind(this);
		this.handleTransactionBid = this.handleTransactionBid.bind(this);
		this.handleTransactionCustomer = this.handleTransactionCustomer.bind(this);
		this.handleTransactionDate = this.handleTransactionDate.bind(this);
		this.handleTransactionProduct = this.handleTransactionProduct.bind(this);
		this.handleTransactionPayment = this.handleTransactionPayment.bind(this);
		this.handleTransactionQuantity = this.handleTransactionQuantity.bind(this);
		this.handleTransactionPrice = this.handleTransactionPrice.bind(this);

		this.handleAddTransactionClick = this.handleAddTransactionClick.bind(this);

		this.renderUserTable = this.renderUserTable.bind(this);
		this.renderBusinessTable = this.renderBusinessTable.bind(this);
		this.renderTransactionTable = this.renderTransactionTable.bind(this);
	}

	getTokenStudent() {
		let myStorage = window.localStorage;
		if (this.state.token !== 0 && this.state.token !== null){
				alert("User already has a Token!");
		}
		else {
			let uid = 'student';

			fetch('http://' + ip + ':2021/auth?uid=' + uid, {
				mode: 'cors',
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				}}).then(response => {
					return response.json();
				}).then(data => {
					if (data.token){
						this.setState({token: data.token});
						if (data.role >= 1){
								this.setState({role: data.role});
								myStorage.setItem('jwt',"Bearer " + this.state.token);
								myStorage.setItem('role', data.role);
						}
						else if (data.role === 0){
								this.setState({role: data.role});
								myStorage.setItem('jwt',"Bearer " + this.state.token);
								myStorage.setItem('role', data.role);
						}
						else {
								alert("No role specified!");
								this.setState({token: 0});
						}
						//redirect to instructor or student account
					} else {
						this.setState({token: 0});
							alert(data.error);
					}
					console.log('Success:', data);
				}).catch((error) => {
					console.error('Error:', error);
				});
			}
	}
	getTokenInstructor() {
		let myStorage = window.localStorage;
		if (this.state.token !== 0 && this.state.token !== null){
				alert("User already has a Token!");
		}
		else {
			let uid = 'instructor';

			fetch('http://' + ip + ':2021/auth?uid=' + uid, {
				mode: 'cors',
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				}}).then(response => {
					return response.json();
				}).then(data => {
					if (data.token){
						this.setState({token: data.token});
						if (data.role >= 1){
								this.setState({role: data.role});
								myStorage.setItem('jwt',"Bearer " + this.state.token);
								myStorage.setItem('role', data.role);
						}
						else if (data.role === 0){
								this.setState({role: data.role});
								myStorage.setItem('jwt',"Bearer " + this.state.token);
								myStorage.setItem('role', data.role);
						}
						else {
								alert("No role specified!");
								this.setState({token: 0});
						}
						//redirect to instructor or student account
					} else {
						this.setState({token: 0});
							alert(data.error);
					}
					console.log('Success:', data);
				}).catch((error) => {
					console.error('Error:', error);
				});
			}
	}
	getTokenAdmin() {
		let myStorage = window.localStorage;
		if (this.state.token !== 0 && this.state.token !== null){
				alert("User already has a Token!");
		}
		else {
			let uid = 'admin';

			fetch('http://' + ip + ':2021/auth?uid=' + uid, {
				mode: 'cors',
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				}}).then(response => {
					return response.json();
				}).then(data => {
					if (data.token){
						this.setState({token: data.token});
						if (data.role >= 1){
								this.setState({role: data.role});
								myStorage.setItem('jwt',"Bearer " + this.state.token);
								myStorage.setItem('role', data.role);
						}
						else if (data.role === 0){
								this.setState({role: data.role});
								myStorage.setItem('jwt',"Bearer " + this.state.token);
								myStorage.setItem('role', data.role);
						}
						else {
								alert("No role specified!");
								this.setState({token: 0});
						}
						//redirect to instructor or student account
					} else {
						this.setState({token: 0});
							alert(data.error);
					}
					console.log('Success:', data);
				}).catch((error) => {
					console.error('Error:', error);
				});
		}
	}

	handleIndexChange(e){
		this.setState({ind: e.target.value});
	}
	handleRowsChange(e){
		this.setState({rows: e.target.value});
	}
	handleGetMultipleBusinessClick(){
		fetch('http://' + ip + ':2021/business?start=' + this.state.ind + '&end=' + this.state.rows, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			}
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			this.setState({businessTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	handleGetMultipleUsersClick(){
		fetch('http://' + ip + ':2021/user?start=' + this.state.ind + '&end=' + this.state.rows, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			}
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			this.setState({userTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	handleBidChange(e){
		this.setState({bid: e.target.value});
	}
	handleGetMultipleTransactionsClick(){
		fetch('http://' + ip + ':2021/transaction?start=' + this.state.ind + '&end=' + this.state.rows + '&bid=' + this.state.bid, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			}
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			this.setState({transactionTable:data});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handleFirstChange(e){
		this.setState({first: e.target.value});
	}
	handleLastChange(e){
		this.setState({last: e.target.value});
	}
	handleUidChange(e){
		this.setState({temp_uid: e.target.value});
	}
	handleRoleChange(e){
		this.setState({role: e.target.value});
	}

	handleAddUserClick(){
		let bod = {user:{uid:this.state.temp_uid, first:this.state.first, last:this.state.last, role:this.state.role}};

		fetch('http://' + ip + ':2021/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			},
			body: JSON.stringify(bod)
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	handleGetUserClick(){
		fetch('http://' + ip + ':2021/user/byuid?uid=' + this.state.temp_uid, {
			mode: 'cors',
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			}
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			this.setState({role:data.role, first:data.first, last:data.last});
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	handleModifyUserClick(){
		let bod = {user:{uid:this.state.temp_uid, first:this.state.first, last:this.state.last, role:this.state.role}};

		fetch('http://' + ip + ':2021/user/', {
			mode: 'cors',
			method: 'PUT',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			},
			body: JSON.stringify(bod)
		}).then(response => {
			console.log(response);
		}).then(data => {
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	handleDeleteUserClick(){
		fetch('http://' + ip + ':2021/user/byuid?uid=' + this.state.temp_uid, {
			mode: 'cors',
			method: 'DELETE',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			},
		}).then(response => {
			console.log(response);
		}).then(data => {
			console.log('Success:', data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handleBusinessNameChange(e){
		this.setState({businessName: e.target.value});
	}
	handleBusinessSecChange(e){
		this.setState({businessSection: e.target.value});
	}

	handleAddBusinessClick(){
		let body = {business:{name:this.state.businessName, section:this.state.businessSection}};

		fetch('http://' + ip + ':2021/business', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			},
			body: JSON.stringify(body)
		}).then(response => {
			console.log(response);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	handleTransactionUid(e){
		this.setState({tUid: e.target.value});
	}
	handleTransactionBid(e){
		this.setState({tBid: e.target.value});
	}
	handleTransactionCustomer(e){
		this.setState({customer: e.target.value});
	}
	handleTransactionDate(e){
		this.setState({date: e.target.value});
	}
	handleTransactionProduct(e){
		this.setState({product: e.target.value});
	}
	handleTransactionPayment(e){
		this.setState({payment: e.target.value});
	}
	handleTransactionQuantity(e){
		this.setState({tQuantity: e.target.value});
	}
	handleTransactionPrice(e){
		this.setState({tPrice: e.target.value});
	}

	handleAddTransactionClick(){
		let body = {transaction:{uid:this.state.tUid, bid:this.state.tBid, customer:this.state.customer, date:this.state.date, product:this.state.product, payment:this.state.payment, quantity:this.state.tQuantity, price:this.state.tPrice}};

		fetch('http://' + ip + ':2021/transaction', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': `bearer ${this.state.token}`
			},
			body: JSON.stringify(body)
		}).then(response => {
			console.log(response);
			return response.json();
		}).then(data => {
			console.log('Success:', data);
			alert(data.data);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	renderUserTable(){
		return this.state.userTable.map((student, index) => {
			const {first, last, uid, role} = student;
			return (
				<tr key={uid}>
					<td>{index+1}</td>
					<td>{first}</td>
					<td>{last}</td>
					<td>{role}</td>
					<td>{uid}</td>
				</tr>
			)});
	}
	renderBusinessTable(){
		return this.state.businessTable.map((business, index) => {
			const {name, bid, profit} = business;
			return (
				<tr key={bid}>
					<td>{index+1}</td>
					<td>{bid}</td>
					<td>{name}</td>
					<td>{profit}</td>
				</tr>
			)});
	}
	renderTransactionTable(){
		return this.state.transactionTable.map((transaction, index) => {
			const {uid, bid, tid, total} = transaction;
			return (
				<tr key={tid}>
					<td>{index+1}</td>
					<td>{uid}</td>
					<td>{bid}</td>
					<td>{tid}</td>
					<td>{total}</td>
				</tr>
			)});
	}

	render () {
		return (
			<React.Fragment >
			<div style={{display: 'flex', flexDirection: 'row'}}>
				<div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
					<div style={{flex: '1', paddingTop:'5px', paddingBottom:'5px' , textAlign: 'center' }}><>
					<Button onClick={this.getTokenStudent} style={{width: '300px',flex: '1' , textAlign: 'center',   display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button0Text} />{' '}</>
					</div>
					<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
					<Button onClick={this.getTokenInstructor} style={{ width: '300px', flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button1Text} />{' '}</>
					</div>
					<div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
					<Button onClick={this.getTokenAdmin} style={{width: '300px',flex: '1' , textAlign: 'center', display: 'inline-block', height: '50px' }} as="input" type="button" value={this.state.button2Text} />{' '}</>
					</div>
				</div>
				<div style={{display: 'flex', flex: '1', paddingTop: '10px'}}>
					<Form style={{flex: '1'}}>
						<Form.Label>Get Multiple</Form.Label>
						<Form.Control placeholder="index (i)" onChange={this.handleIndexChange} />
						<Form.Control placeholder="rows (r)" onChange={this.handleRowsChange} />
						<Button onClick={this.handleGetMultipleUsersClick}>
						Get Users from (i to i+r)
						</Button>
						<Button onClick={this.handleGetMultipleBusinessClick}>
						Get Business from (i to i+r)
						</Button>
						<Form.Control placeholder="bid" onChange={this.handleBidChange} />
						<Button onClick={this.handleGetMultipleTransactionsClick}>
						Get Transactions from bid in range (i to i+r)
						</Button>
					</Form>
				</div>
				<div style={{display: 'flex', flex: '1', paddingTop: '10px'}}>
					<Form style={{flex: '1'}}>
						<Form.Label>User Management</Form.Label>
						<Form.Control placeholder="first" onChange={this.handleFirstChange} />
						<Form.Control placeholder="last" onChange={this.handleLastChange} />
						<Form.Control placeholder="uid" onChange={this.handleUidChange} />
						<Form.Control placeholder="role" onChange={this.handleRoleChange} />
						<Button onClick={this.handleAddUserClick}>
						Add User
						</Button>
						<Button onClick={this.handleGetUserClick}>
						Get User by UID
						</Button>
						<Button onClick={this.handleModifyUserClick}>
						Modify User by UID
						</Button>
						<Button onClick={this.handleDeleteUserClick}>
						Delete User by UID
						</Button>
					</Form>
				</div>
				<div style={{display: 'flex', flex: '1', paddingTop: '10px'}}>
					<Form style={{flex: '1'}}>
						<Form.Label>Business Management</Form.Label>
						<Form.Control placeholder="name" onChange={this.handleBusinessNameChange} />
						<Form.Control placeholder="section" onChange={this.handleBusinessSecChange} />
						<Button onClick={this.handleAddBusinessClick}>
						Add Business
						</Button>
					</Form>
				</div>
				<div style={{display: 'flex', flex: '1', paddingTop: '10px'}}>
					<Form style={{flex: '1'}}>
						<Form.Label>Transactions</Form.Label>
						<Form.Control placeholder="uid" onChange={this.handleTransactionUid} />
						<Form.Control placeholder="bid" onChange={this.handleTransactionBid} />
						<Form.Control placeholder="customer" onChange={this.handleTransactionCustomer} />
						<Form.Control placeholder="date (yyyy-mm-dd)" onChange={this.handleTransactionDate} />
						<Form.Control placeholder="product" onChange={this.handleTransactionProduct} />
						<Form.Control placeholder="payment" onChange={this.handleTransactionPayment} />
						<Form.Control placeholder="quantity" onChange={this.handleTransactionQuantity} />
						<Form.Control placeholder="price" onChange={this.handleTransactionPrice} />
						<Button onClick={this.handleAddTransactionClick}>
						Add Transaction
						</Button>
					</Form>
				</div>
			</div>
			user table
			<Table responsive>
				<thead>
					<tr>
						<th>#</th>
						<th>First</th>
						<th>Last</th>
						<th>Role</th>
						<th>UID</th>
					</tr>
				</thead>
				<tbody>
					{this.renderUserTable()}
				</tbody>
			</Table>
			business table
			<Table responsive>
				<thead>
					<tr>
						<th>#</th>
						<th>BID</th>
						<th>Name</th>
						<th>Profit</th>
					</tr>
				</thead>
				<tbody>
					{this.renderBusinessTable()}
				</tbody>
			</Table>
			transaction table
			<Table responsive>
				<thead>
					<tr>
						<th>#</th>
						<th>uid</th>
						<th>bid</th>
						<th>tid</th>
						<th>total</th>
					</tr>
				</thead>
				<tbody>
					{this.renderTransactionTable()}
				</tbody>
			</Table>
			</React.Fragment>
		);
	}
}
