const { Pool } = require('pg');

const pool = new Pool();

function init(){
	pool.on('error', (err, client) => {
		console.error('Unexpected error on idle client', err)
		process.exit(-1)
	})
}

function getBid(uid){
	// callback - checkout a client
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query('SELECT bid FROM student WHERE uid = $1', [uid], (err, res) => {
			done()
			if (err) {
				console.log(err.stack)
			} else {
				console.log(res.rows[0])
			}
		})
	})
}

function getExpense(uid){
	return selectQuery('SELECT bid FROM student WHERE uid = $1', [uid]);
}

function selectQuery(statement, values){
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
exports.getBid = getBid;
exports.getExpense = getExpense;
