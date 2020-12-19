const express = require('express');
const router = express.Router();
let authenticator = require('../authenticator');

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	token = authenticator.authenticate("jess", req.ip);
	res.send(JSON.stringify({status: "0", token: token}));

});

module.exports = router;
