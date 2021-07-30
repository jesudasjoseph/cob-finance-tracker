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
			userBody = {user: {uid: users[i].uid, first: users[i].first, last: users[i].last, section: users[i].section, role: users[i].role}}
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
			companyBody = {business: {name: data.companies[i].name, section: data.companies[i].section, instructor: data.companies[i].instructor}}
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

	}
}
function importExpenses(expenses){
	if (expenses){

	}
}
function importTransactions(transactions){
	if (transactions){

	}
}
