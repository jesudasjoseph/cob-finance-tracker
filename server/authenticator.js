let current_users = [];

//Insecure! Replace with a proper crypto safe random key generator or a hash function that takes username+ip+salt
function generateToken(username, ip){
	let token;
	while(1){
		token =  Math.floor(Math.random() * (1000000000000 - 100000000) + 100000000) + username + ip;
		let checks = 0;
		for (i = 0; i<current_users.length; i++){
			if (token == current_users[i].token){
				break;
			}
			checks++;
		}
		if (checks == current_users.length){
			return token;
		}
	}
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
	current_users.push({"username":user, "ip":ip, "token":token});
	console.log(current_users);
	return token;
}

//returns 1 on success
//returns -1 on auth_obj parsing error
//returns -2 on non authenticated token
function validate_token(auth_obj){
	try {
		auth_obj = JSON.parse(auth_obj);
	}
	catch(e) {
		console.log(e);
		throw "Failed to Authorize: Invalid Auth Token Format!";
	}
	for (i = 0; i<current_users.length; i++){
		console.log("Token: " + current_users[i].token);
		console.log("Client Token: " + auth_obj.token + ", typeof auth_obj:" + typeof auth_obj);
		if (auth_obj.token == current_users[i].token){
			console.log("Found a Token Match:" + auth_obj.token + ", username:" + current_users[i].username);
			if (auth_obj.username == current_users[i].username){
				return 1;
			}
		}
	}
	throw "Failed to Authorize: Invalid Auth Token!";
}

function getCurrentUsers(){
	return this.current_users;
}

exports.authenticate = authenticate;
exports.validate_token = validate_token;
