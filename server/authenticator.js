//Not sure if this is depricated
const crypto = require('crypto');
let current_users = [];
let next_token = 1111111111111111;
let last_token;

function generateToken(username, ip){
	return crypto.webcrypto.generateKey({name:"AES-CBC", length:256}, false, ["verify"], (err, key) => {
		if (err) throw err;
	});
}

function getToken(username, password, ip){
	//Add password encryption
	//Checks username and password match
	if (username == "jess" && password == "password"){
		return generateToken(username, ip);
	}
	else{
		//Failed to getToken
		//Password and Username do not match
		return -1;
	}
}

function authenticate(user, ip){
	const token = getToken("jess", "password", ip);
	current_users.push({"user":user, "ip":ip, "token":token});
	console.log(current_users);
	return token;
}

function getCurrentUsers(){
	return this.current_users;
}

exports.authenticate = authenticate;
exports.getCurrentUsers = getCurrentUsers;
