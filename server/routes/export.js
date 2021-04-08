const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/expense', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'text/csv');
	let {code, data} = await q.getExpenseDataCSV(req.body.asker, req.query.bid);
	res.statusCode = code;
	res.send(data);
});
