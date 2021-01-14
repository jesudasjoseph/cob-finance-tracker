const express = require('express');
const router = express.Router();
let authenticator = require('../authenticator');

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {
	let token;
	//res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	token = authenticator.getToken("jess", "password", req.ip);
	if (token === -1 || token === -2){
		console.log("Failed to get Token!");
		token = 0;
	}
	else{
		authenticator.createSession("jess", req.ip, token);
	}
	res.send(JSON.stringify({token: token}));

});

//Get Credentials and Authenticate! (user = jess and password = password as default)
router.post('/', function(req, res, next) {
	let token;
	//res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	console.log(req.body);
	token = authenticator.getToken(req.body.user, req.body.password, req.ip);
	if (token === -1 || token === -2){
		console.log("Failed to get Token!");
		token = 0;
	}
	else{
		authenticator.createSession(req.body.user, req.ip, token);
	}
	res.send(JSON.stringify({"token":token}));

});

module.exports = router;
