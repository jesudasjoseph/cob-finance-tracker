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
	current_users.push({"user":user, "ip":ip, "token":token});
	console.log(current_users);
	return token;
}

function getCurrentUsers(){
	return this.current_users;
}

exports.authenticate = authenticate;
