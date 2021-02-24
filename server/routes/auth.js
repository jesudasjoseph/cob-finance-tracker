const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');

//Get Credentials and Authenticate! (user = jess and password = password as default)
//Returns valid token/role of user if found in database
//On error return a token == 0; and role == 0;
router.post('/', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await authorizor.getToken(req.body.uid, req.ip);
	console.log("Sending token to: '" + req.body.uid + "'");
	res.send(JSON.stringify(data));

});

router.get('/', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	if (req.query.uid != undefined) {
		let {code, data} = await authorizor.getToken(req.query.uid, req.ip);
		console.log("Sending token to: '" + req.query.uid + "'");
		res.send(JSON.stringify(data));
	}
	else {
		res.statusCode = 400;
		console.log("Bad auth request!");
		res.send(JSON.stringify({error:"Requires uid param."}));
	}

});

module.exports = router;
