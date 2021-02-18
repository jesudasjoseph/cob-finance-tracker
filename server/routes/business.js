const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

router.get('/overview', authorizor.authToken, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = await q.getBusinessOverview(req.body.asker, req.query.start, req.query.end);
	res.send(JSON.stringify(result));
});

module.exports = router;
