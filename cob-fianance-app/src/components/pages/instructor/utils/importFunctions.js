import {API_PATH} from '../../../Config';

export function startImport(data, updateProgress){

	importUsers(data.users, updateProgress);
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
					'Accept': 'application/json',
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
