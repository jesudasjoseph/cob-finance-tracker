const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/', authorizor.authToken, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = await q.getMultipleTransactions(req.body.asker, req.query.start, req.query.end, req.query.bid);
	res.send(JSON.stringify(result));
});

router.post('/', authorizor.authToken, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = await q.addTransaction(req.body.asker, req.body.transaction);
	res.send(JSON.stringify(result));
});

module.exports = router;
