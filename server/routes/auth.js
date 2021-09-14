const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');

//Get Credentials and Authenticate - Must be an Administrator (role=2)!
//Returns valid token/role of user if found in database
//Query parameter: user_id
router.get('/', authorizor.authToken, async (req, res) => {
	if (req.body.asker.role === 2) {
		if (req.query.user_id != undefined) {
			res.setHeader('Content-Type', 'application/json');
			let {code, data} = await authorizor.getToken(req.query.user_id);
			console.log("Sending token to: '" + req.query.user_id + "'");
			res.send(JSON.stringify(data));
		}
		else {
			res.statusCode = 400;
			res.end();
		}
	}
	else {
		res.statusCode = 403;
		console.log("Forbidden auth request");
		res.end();
	}
});

module.exports = router;
