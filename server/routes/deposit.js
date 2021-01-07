const express = require('express');
const router = express.Router();
let authenticator = require('../authenticator');

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	if (authenticator.validate_token(req.get('Authorization'))){
		res.send("This Token is Authorized!");
	}
	else
		res.send("Failed to Authenticate!");
});

module.exports = router;
