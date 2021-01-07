const express = require('express');
const router = express.Router();
let authenticator = require('../authenticator');

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	try{
		authenticator.validate_token(req.get('Authorization'));
		authenticator.validate_user_priv();
		res.send("This Token is Authorized!");
	}
	catch(e){
		res.send(e);
	}
});

module.exports = router;
