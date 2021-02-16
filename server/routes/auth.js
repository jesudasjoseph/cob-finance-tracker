const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');

//Get Credentials and Authenticate! (user = jess and password = password as default)
//Returns valid token/role of user if found in database
//On error return a token == 0; and role == 0;
router.post('/', async (req, res) => {
	let tokenRoleObj;
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	tokenRoleObj = await authorizor.getToken(req.body.uid, req.ip);
	console.log(req.body.uid);
	console.log(tokenRoleObj);
	res.send(JSON.stringify(tokenRoleObj));

});

module.exports = router;
