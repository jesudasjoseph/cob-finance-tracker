const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');

router.get('/reset-code', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getResetCode(req.body.asker);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.delete('/reset-database', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.resetDatabase(req.body.asker, req.query.code);
	res.statusCode = code;
	res.end();
});
