const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

/*GET request for /auth (returns token)*/
router.get('/', function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.send(q.getExpense(4));

});

module.exports = router;
