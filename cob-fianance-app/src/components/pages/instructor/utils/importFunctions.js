import {API_PATH} from '../../../Config';

export function startImport(data, updateProgress){

	importUsers(data.users, updateProgress);
	importCompanies(data, updateProgress);
}

function importUsers(users, updateProgress){
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
				updateProgress(100/users.length*(i+1), 'Importing Users');
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}
function importCompanies(data, updateProgress){
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
				updateProgress(100/data.companies.length*(i+1), 'Importing Companies');
				if (i+1 === data.companies.length){
					updateProgress(100, 'Companies Imported');
					importDeposits(data, updateProgress);
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}
function importDeposits(data, updateProgress){
	if (data.deposits){
		
	}
}
