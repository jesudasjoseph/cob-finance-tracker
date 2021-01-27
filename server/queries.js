const { Pool } = require('pg');

const pool = new Pool();

function init(){
	pool.on('error', (err, client) => {
		console.error('Unexpected error on idle client', err)
		process.exit(-1)
	})
}

function getExpense(uid) {
	return query('SELECT * FROM expense WHERE bid = (SELECT bid FROM student WHERE uid = $1)', [uid]);
}

function getUser(uid) {
	return query('SELECT * FROM user', [uid]);
}

function query(statement, values){
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(statement, values, (err, res) => {
			done()
			if (err) {
				console.log(err.stack)
			} else {
				return res;
			}
		})
	})
}

exports.init = init;
exports.getExpense = getExpense;
