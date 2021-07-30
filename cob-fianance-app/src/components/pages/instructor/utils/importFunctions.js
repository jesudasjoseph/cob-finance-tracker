import {API_PATH} from '../../../Config';

//let updateProgress;

export function startImport(data, callBack){
	//updateProgress = callBack;
	importUsers(data.users);
	importCompanies(data);
}

function importUsers(users){
	if (users){
		let userBody;
		for (let i = 0; i < users.length; i++){
			userBody = {user: users[i]}
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
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}
function importCompanies(data){
	if (data.companies){
		let companyBody;
		for (let i = 0; i < data.companies.length; i++){
			companyBody = {business: data.companies[i]}
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
				importDeposits(data.companies[i].deposits);
				importExpenses(data.companies[i].expenses);
				importTransactions(data.companies[i].transactions);
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}

function importDeposits(deposits){
	if (deposits){
		for (let i = 0; i < deposits.length; i++){
			const depositBody = {deposit: deposits[i]}
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
				console.log(response);
			}).catch((error) => {
				console.error('Error:', error);
			});
		}
	}
}
function importExpenses(expenses){
	if (expenses){
		for (let i = 0; i < expenses.length; i++){
			const expenseBody = {expense: expenses[i]}
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
				console.log(response);
			}).catch((error) => {
				console.error('Error:', error);
			});
		}
	}
}
function importTransactions(transactions){
	if (transactions){
		for (let i = 0; i < transactions.length; i++){
			const transactionBody = {transaction: transactions[i]}
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
				console.log(response);
			}).catch((error) => {
				console.error('Error:', error);
			});
		}
	}
}
