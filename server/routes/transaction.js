const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getMultipleTransactions(req.body.asker, req.query.start, req.query.end);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/bybid', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getMultipleTransactionsByBid(req.body.asker, req.query.start, req.query.end, req.query.bid);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/byuid', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let searchText = '';
	if (req.query.search){
		searchText = req.query.search;
	}
	let {code, data} = await q.getMultipleTransactionsByUid(req.body.asker, req.query.start, req.query.end, searchText);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});


router.post('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.addTransaction(req.body.asker, req.body.transaction);
	res.statusCode = code;
	res.end();
});

router.delete('/bytid', authorizor.authToken, async (req, res) => {
	let {code} = await q.deleteTransactionByTid(req.body.asker, req.query.tid);
	res.statusCode = code;
	res.end();
});

module.exports = router;
