const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let searchText = '';
	if (req.query.search){
		searchText = req.query.search;
	}
	let {code, data} = await q.getMultipleDeposits(req.body.asker, req.query.start, req.query.end, req.query.bid, searchText);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.post('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.addDeposit(req.body.asker, req.body.deposit);
	res.statusCode = code;
	res.end();
});

router.delete('/bydid', authorizor.authToken, async (req, res) => {
	let {code} = await q.deleteDepositByDid(req.body.asker, req.query.did);
	res.statusCode = code;
	res.end();
});

module.exports = router;
