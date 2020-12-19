const express = require('express');
const router = express.Router();

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send("User GET");

});

module.exports = router;
