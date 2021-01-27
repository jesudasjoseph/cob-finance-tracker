const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

/*GET request for /user (returns token)*/
router.get('/', authorizor.authToken, function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.send("User GET");

});

/*POST*/
router.post('/', authorizor.authToken, function(req, res, next) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = q.createUser(req.body.asker, req.body.user);
	res.send(result);
});

module.exports = router;
