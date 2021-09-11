const express = require('express');
const router = express.Router();
const q = require('../queries');

app.get('/auth', async (req, res) => {
	if (req.query.password){
		if (req.query.password === config.devPassword){
			const {code, data} = await authorizor.getToken(config.devUsername);
			res.setHeader('Content-Type', 'application/json');
			console.log("Sending dev token!");
			res.statusCode = code;
			res.send(JSON.stringify(data));
		} else {
			res.statusCode = 403;
			console.log("Forbidden dev/auth request");
			res.end();
		}
	}
});

module.exports = router;