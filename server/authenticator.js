let current_users = [];
let next_token = 1111111111111111;
let last_token;

function authenticate(user, ip){
	last_token = next_token;
	next_token++;
	current_users.push({"user":user, "ip":ip, "token":last_token});
	console.log(current_users);
	return last_token;
}

function checkAuthentication(){

}

function getCurrentUsers(){
	return this.current_users;
}

exports.authenticate = authenticate;
exports.getCurrentUsers = getCurrentUsers;
