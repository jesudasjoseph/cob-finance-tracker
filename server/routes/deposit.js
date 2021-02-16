const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

/*GET request for /deposit (gets deposit for provided bid)*/
router.get('/', authorizor.authToken, function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.send({'message': 'message'});

});

module.exports = router;
