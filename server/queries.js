const { Pool } = require('pg');

const pool = new Pool();

const roleType = {
	'admin':2,
	'instructor':1,
	'student':0
};

function data(error, data){
	this.error = error;
	this.data = data;
}

function asker(uid, role){
	this.uid = uid;
	this.role = role;
}

function user(uid, role, first, last){
	this.uid = uid;
	this.role = role;
	this.first = first;
	this.last = last;
}

function init(){
	pool.on('error', (err, client) => {
		console.error('Unexpected error on idle client', err)
		process.exit(-1)
	})

	console.log(query('SELECT role FROM "user" WHERE uid = $1', ['josejesu']).then());
}

function getExpense(uid) {
	return query('SELECT * FROM expense WHERE bid = (SELECT bid FROM student WHERE uid = $1)', [uid]);
}

//This is a model function
function createUser(asker, user) {
	switch(asker.role){
		case roleType.admin:
			return query('INSERT INTO "user" (uid, role, first, last) VALUES ($1, $2, $3, $4)', [user.uid, user.role, user.first, user.last]);
			break;
		case roleType.instructor:
			if (user.role != roleType.admin){
				return query('INSERT INTO "user" (uid, role, first, last) VALUES ($1, $2, $3, $4)', [user.uid, user.role, user.first, user.last]);
			}
			break;
		case roleType.student:
			return new data('Students cannot create accounts!', '');
			break;
	}
	return new data('Failed to add user!', '');
}

function getUser(asker, uid) {
	if (asker.uid === uid || asker.role >= 1){
			return query('SELECT * FROM "user" WHERE uid == $1', [uid]);
	}
	else {
		return new data('Permission Denied', '');
	}
}

function getRole(asker){
	return query('SELECT role FROM "user" WHERE uid = $1', [asker.uid]).then();
}

function query(statement, values){
	const curQuery = {
		text: statement,
		values: values
	};

	return pool
		.connect()
		.then(client => {
			return client
				.query(curQuery)
				.then(res => {
					client.release();
					return new data(null, res[0]);
				})
			.catch(err => {
				console.log(err.stack)
				return new data('Failed to Query Database!', '');
			})
		})
}

exports.init = init;
exports.getExpense = getExpense;
exports.getRole = getRole;
exports.createUser = createUser;
exports.data = data;
exports.asker = asker;
exports.user = user;
exports.roleType = roleType;
