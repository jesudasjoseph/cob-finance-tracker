const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/', authorizor.authToken, async (req, res) => {
	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.send({'message': 'message'});

});

module.exports = router;
