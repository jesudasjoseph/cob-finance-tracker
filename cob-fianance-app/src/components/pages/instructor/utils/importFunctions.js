import {API_PATH} from '../../../Config';

//let updateProgress;

export function startImport(data, callBack){
	importUsers(data);
}

function addUser(data, index){
	if (data.users[index]){
		let userBody = {user: data.users[index]}
		console.log(userBody);
		fetch(API_PATH + '/user', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(userBody)
		}).then(response => {
			addUser(data, ++index);
		}).catch((error) => {
			console.log(error);
		});
	}
	else{
		importCompanies(data);
	}
}
function importUsers(data){
	if (data.users){
		addUser(data, 0);
	}
}
function addCompany(data, index){
	if (data.companies[index]){
		console.log(data.companies[index]);
		let companyBody = {business: data.companies[index]}
		fetch(API_PATH + '/business', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(companyBody)
		}).then(response => {
			setTimeout(importDeposits(data.companies[index].deposits), 500);
			setTimeout(importExpenses(data.companies[index].expenses), 1000);
			setTimeout(importTransactions(data.companies[index].transactions), 1500);
			importUserCompany(data.companies[index].users, data.companies[index].company_id);
			addCompany(data, ++index);
		}).catch((error) => {
			console.log(error);
		});
	}
}
function importCompanies(data){
	if (data.companies){
		addCompany(data, 0);
	}
}

function addUsersToCompany(users, company, index){
	if (users[index]){
		fetch(API_PATH + '/user/addtobusiness', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify({user_iud: users[index], company_id: company})
		}).then(response => {
			addUsersToCompany(users, company, ++index);
		}).catch((error) => {
			console.log('Error:', error);
		});
	}
}
function importUserCompany(users, company){
	if (users){
		addUsersToCompany(users, company, 0);
	}
}

function addDeposit(deposits, index){
	if (deposits[index]){
		const depositBody = {deposit: deposits[index]}
		fetch(API_PATH + '/deposit', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(depositBody)
		}).then((response) => {
			addDeposit(deposits, ++index);
			console.log(response);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
}
function importDeposits(deposits){
	if (deposits){
		addDeposit(deposits, 0);
	}
}

function addExpense(expenses, index){
	if (expenses[index]){
		const expenseBody = {expense: expenses[index]}
		fetch(API_PATH + '/expense', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(expenseBody)
		}).then((response) => {
			addExpense(expenses, ++index);
			console.log(response);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
}
function importExpenses(expenses){
	if (expenses){
		addExpense(expenses, 0);
	}
}

function addTransaction(transactions, index){
	if (transactions[index]){
		const transactionBody = {transaction: transactions[index]}
		fetch(API_PATH + '/transaction', {
			mode: 'cors',
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-type': 'application/json',
				'Authorization': window.localStorage.getItem('jwt')
			},
			body: JSON.stringify(transactionBody)
		}).then((response) => {
			addTransaction(transactions, ++index);
			console.log(response);
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
}
function importTransactions(transactions){
	if (transactions){
		addTransaction(transactions, 0);
	}
}
