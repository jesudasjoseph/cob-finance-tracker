const express = require('express');
const router = express.Router();
const authorizor = require('../authorizor');
const q = require('../queries');

/*GET request for /user by uid (returns single user object)*/
router.get('/byuid', authorizor.authToken, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = await q.getUserByUid(req.body.asker, req.query.uid);
	res.send(JSON.stringify(result));
});

router.get('/', authorizor.authToken, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = await q.getMultipleUsers(req.body.asker, req.query.start, req.query.end);
	res.send(JSON.stringify(result));
});

router.put('/', authorizor.authToken, async (req, res) => {
	let result = await q.modifyUser(req.body.asker, req.body.user);
	if (result.data != undefined) {
		res.statusCode = result.data;
	}
	res.end();
});

router.delete('/byuid', authorizor.authToken, async (req, res) => {
	let result = await q.deleteUserByUid(req.body.asker, req.query.uid);
	if (result.data != undefined){
		res.statusCode = result.data;
	}
	res.end();
});

/*POST*/
router.post('/', authorizor.authToken, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	let result = await q.createUser(req.body.asker, req.body.user);
	res.send(JSON.stringify(result));
});

module.exports = router;
