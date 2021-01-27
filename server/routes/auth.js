const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');

/*GET request for /auth (returns token)*/
/*
router.get('/', function(req, res, next) {
	let token;
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	//*****
	//Add authentication step
	//*****

	//get authorization token
	token = authorizor.getToken("jess", req.ip);
	res.send(JSON.stringify({"token":token}));

});
*/

//Get Credentials and Authenticate! (user = jess and password = password as default)
router.post('/', function(req, res, next) {
	let tokenRoleObj;
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	tokenRoleObj = authorizor.getToken(req.body.uid, req.ip);
	console.log(req.body.uid);
	res.send(JSON.stringify(tokenRoleObj));

});

module.exports = router;
