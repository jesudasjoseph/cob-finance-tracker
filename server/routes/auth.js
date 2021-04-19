const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');

//Get Credentials and Authenticate! (user = jess and password = password as default)
//Returns valid token/role of user if found in database
//On error return a token == 0; and role == 0;
router.get('/', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	if (req.query.uid != undefined) {
		let {code, data} = await authorizor.getToken(req.query.uid);
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
