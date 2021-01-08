const SESSION_TIMEOUT = 5000; //seconds

function session(user, ip, token) {
	this.user = user;
	this.ip = ip;
	this.token = token;
	this.lifespan = SESSION_TIMEOUT;
	this.timeout = SESSION_TIMEOUT;
}

let sessionList = [];

//Insecure! Replace with a proper crypto safe random key generator or a hash function that takes username+ip+salt
function generateToken(username, ip){
	let token;
	while(1){
		token =  Math.floor(Math.random() * (1000000000000 - 100000000) + 100000000) + username + ip;
		let checks = 0;
		for (i = 0; i<sessionList.length; i++){
			if (username == sessionList[i].user){
				throw "User already signed in!";
			}
			if (token == sessionList[i].token){
				break;
			}
			checks++;
		}
		if (checks == sessionList.length){
			return token;
		}
	}
}

function getToken(username, password, ip){
	//Add password encryption
	//Checks username and password match
	if (username == "jess" && password == "password"){
		try{
			return generateToken(username, ip);
		}catch(error){
			console.log(error);
			throw error;
		}

	}
	else{
		//Failed to getToken
		//Password and Username do not match
		throw "Failed to get token: User/Password mismatch";
	}
}

function authenticate(user, password, ip){
	try{
		const token = getToken(user, password, ip);
		sessionList.push(new session(user, ip, token));
		console.log(sessionList);
		return token;
	}catch (error){
		throw error
	}

}

//Check the value of a token object against current session tokens
function validate_token(auth_obj){
	try {
		auth_obj = JSON.parse(auth_obj);
	}
	catch(error) {
		console.log(error);
		throw "Failed to Authorize: Invalid Auth Token Format!";
	}

	for (i = 0; i<sessionList.length; i++){
		//console.log("Token: " + sessionList[i].token);
		//console.log("Client Token: " + auth_obj.token + ", typeof auth_obj:" + typeof auth_obj);
		if (auth_obj.token == sessionList[i].token){
			//console.log("Found a Token Match:" + auth_obj.token + ", username:" + sessionList[i].user);
			if (auth_obj.user == sessionList[i].user){
				return 1;
			}
		}
	}
	throw "Failed to Authorize: Invalid Auth Token!";
}

function getCurrentUsers(){
	return sessionList;
}

exports.authenticate = authenticate;
exports.validate_token = validate_token;
