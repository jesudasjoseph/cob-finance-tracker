const express = require('express');
const router = express.Router();
let authenticator = require('../authenticator');

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {
	let token;
	//res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	try {
		token = authenticator.authenticate("jess", "password", req.ip);
	}
	catch(error){
		token = 0;
	}
	res.send(JSON.stringify({token: token}));

});

module.exports = router;
