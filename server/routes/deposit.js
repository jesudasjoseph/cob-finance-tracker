const express = require('express');
const router = express.Router();
let authorizor = require('../authorizor');

/*GET request for /deposit (gets deposit for provided bid)*/
router.get('/', authorizor.authToken, function(req, res, next) {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.send("If you made it this far you are a valid token!");
});

module.exports = router;
