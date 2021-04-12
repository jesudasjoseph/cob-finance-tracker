const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getMultipleBusiness(req.body.asker, req.query.start, req.query.end);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/byuid', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getBusinessByUid(req.body.asker);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/bybid', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getBusinessByBid(req.body.asker, req.query.bid);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.post('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.createBusiness(req.body.asker, req.body.business);
	res.statusCode = code;
	res.end();
});

router.put('/byuid/profit_goal' authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.modifyProfitGoal(req.body.asker, req.body.profit_goal);
	res.statusCode = code;
	res.end();
});

router.delete('/bybid', authorizor.authToken, async (req, res) => {
	let {code} = await q.deleteBusinessByBid(req.body.asker, req.query.bid);
	res.statusCode = code;
	res.end();
});

module.exports = router;
