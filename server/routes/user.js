const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

/*GET request for /user by uid (returns single user object)*/
router.get('/byuid', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getUserByUid(req.body.asker, req.query.uid);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/asker', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getUserByAsker(req.body.asker);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/bybid', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getMultipleUsersByBid(req.body.asker, req.query.bid);
	res.statusCode = code;
	res.send(JSON.stringify(data));
});

router.get('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code, data} = await q.getMultipleUsers(req.body.asker, req.query.start, req.query.end, req.query.sort);
	res.statusCode = code;
	res.send(JSON.stringify(data));;
});

router.put('/', authorizor.authToken, async (req, res) => {
	let {code} = await q.modifyUser(req.body.asker, req.body.user);
	res.statusCode = code;
	res.end();
});

router.delete('/byuid', authorizor.authToken, async (req, res) => {
	let {code} = await q.deleteUserByUid(req.body.asker, req.query.uid);
	res.statusCode = code;
	res.end();
});

/*POST*/
router.post('/', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.createUser(req.body.asker, req.body.user);
	res.statusCode = code;
	res.end();
});

router.post('/addtobusiness', authorizor.authToken, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let {code} = await q.addUserToBusiness(req.body.asker, req.body.uid, req.body.bid);
	res.statusCode = code;
	res.end();
});

module.exports = router;
