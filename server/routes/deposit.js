const express = require('express');
const router = express.Router();
let authenticator = require('../authenticator');

/*GET request for /deposit (gets deposit for provided bid)*/
router.get('/', function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	try{
		authenticator.validate_token(req.get('Authorization'));
		res.send("This Token is Authorized!");
	}
	catch(e){
		res.statusCode = 401;
		console.log(e);
		res.send(e);
	}
});

module.exports = router;
