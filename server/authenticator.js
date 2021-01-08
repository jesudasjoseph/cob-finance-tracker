const SESSION_TIMEOUT = 5000; //seconds
const MAX_SESSIONS = 100;

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

}

function getToken(username, password, ip){
	//Add password encryption
	//Checks username and password match
	let token = 0;

	if (username == "jess" && password == "password"){
		while(1){
			token =  Math.floor(Math.random() * (1000000000000 - 100000000) + 100000000) + username + ip;
			let checks = 0;
			for (i = 0; i<sessionList.length; i++){
				if (username == sessionList[i].user){
					return -1;
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
	else{
		//Failed to getToken
		//Password and Username do not match
		return -2;
	}
}

function createSession(user, ip, token){
	sessionList.push(new session(user, ip, token));
	console.log(sessionList);
}

//SUCCESS: returns valid token
//FAIL: returns error codes: -1, -2
function getToken(user, password, ip){
	let token = 0;
	if (user == "jess" && password == "password"){
		while(1){
			token =  Math.floor(Math.random() * (1000000000000 - 100000000) + 100000000) + user + ip;
			let checks = 0;
			for (i = 0; i<sessionList.length; i++){
				if (user == sessionList[i].user){
					//user already has a token
					return -1;
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
	else{
		//Password and Username do not match
		return -2;
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

exports.getToken = getToken;
exports.createSession = createSession;
exports.validate_token = validate_token;
