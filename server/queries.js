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

async function init(){
	pool.on('error', (err, client) => {
		console.error('Unexpected error on idle client', err)
		process.exit(-1)
	})
}

//This is a model function
async function createUser(asker, user) {
	const createUserQuery = {
		text: 'INSERT INTO users (uid, role, first, last) VALUES ($1, $2, $3, $4)',
		values: [user.uid, user.role, user.first, user.last]
	}
	const client = await pool.connect();

	console.log(asker.role);
	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(createUserQuery);
				return new data(undefined, 'Successfully Added User!');
				break;
			case roleType.instructor:
				if (user.role != roleType.admin){
					await client.query(createUserQuery);
					return new data(undefined, 'Successfully Added User!');
				}
				else {
					return new data('Instructors cannot create admin accounts!', undefined);
				}
				break;
			case roleType.student:
				return new data('Students cannot create accounts!', undefined);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	return new data('Failed to add user!', '');
}

async function getUserByUid(asker, uid) {
	const query = {
		text: 'SELECT * FROM "users" WHERE uid = $1',
		values: [uid]
	}
	const client = await pool.connect();
	let res;

	try {
		if (asker.uid === uid || asker.role >= 1){
			res = await client.query(query);
			if (!res.rows.length) {
				return new data("Error! User is undefined!", undefined);
			}
			else {
				return new data(undefined, res.rows[0]);
			}
		}
		else {
			return new data('Permission Denied', undefined);
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}
}

async function getMultipleUsers(asker, start, end) {
	const query = {
		text: 'SELECT * FROM "users" OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
		values: [start, end]
	}
	const client = await pool.connect();
	let res;

	try {
		if (asker.role >= 1){
			res = await client.query(query);
			if (!res.rows.length) {
				return new data("Can't Find any users!", undefined);
			}
			else {
				return new data(undefined, res.rows);
			}
		}
		else {
			return new data('Permission Denied', undefined);
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
		console.log
	}
}

async function modifyUser(asker, user) {
	const query = {
		text: 'UPDATE users SET first = $1, last = $2 WHERE uid=$3',
		values: [user.first, user.last, user.uid]
	}
	const client = await pool.connect();
	let res;

	try {
		if (asker.uid === user.uid || asker.role >= 1){
			res = await client.query(query);
			if (!res.rows.length) {
				return new data("Error! User is undefined!", undefined);
			}
			else {
				return new data(undefined, 200);
			}
		}
		else {
			return new data('Permission Denied', undefined);
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}
}

async function deleteUserByUid(asker, uid) {
	const query = {
		text: 'DELETE FROM users WHERE uid = $1',
		values: [uid]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(query);
				return new data(undefined, 200);
				break;
			case roleType.instructor:
				if (user.role != roleType.admin){
					await client.query(query);
					return new data(undefined, 200);
				}
				else {
					return new data('Instructors cannot delete admin accounts!', undefined);
				}
				break;
			case roleType.student:
				return new data('Students cannot delete accounts!', undefined);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	return new data('Failed to delete user!', '');
}

async function getRole(asker){
	const client = await pool.connect();
	let res;
	try {
		res = await client.query('SELECT role FROM "users" WHERE uid = $1', [asker.uid]);
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	if (!res.rows.length) {
		return new data("Error! User is undefined!", undefined);
	}
	else {
		return new data(undefined, res.rows[0].role);
	}
}

//Business Queries
//name, instructor, section, revenue, bank, square, expenses, profit
async function getMultipleBusiness(asker, start, end) {
	const query = {
		//text: 'SELECT name, section, transaction_total, bank_total, expense_total, profit, first, last FROM business LEFT JOIN user_has_business ON (business.bid=user_has_business.bid) LEFT JOIN users ON (users.uid=user_has_business.uid) OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		text: 'SELECT * FROM business OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end]
	}
	const client = await pool.connect();
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data('Unauthorized!', undefined);
				break;
			default:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data("Can't Find any Businesses!", undefined);
				}
				else {
					return new data(undefined, res.rows);
				}
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	return new data('Failed to get Businesses!', '');
}
async function createBusiness(asker, business) {
	const query = {
		text: 'INSERT INTO business (name, section) VALUES ($1, $2)',
		values: [business.name, business.section]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.student:
				return new data('Students cannot create businesses!', undefined);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(undefined, 'Successfully Added Business!');
				break;
			case roleType.admin:
				await client.query(query);
				return new data(undefined, 'Successfully Added Business!');
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	return new data('Failed to add business!', undefined);
}

//Transaction Queries
//Fix permissions
async function getMultipleTransactions(asker, start, end, bid) {
	const query = {
		//text: 'SELECT name, section, transaction_total, bank_total, expense_total, profit, first, last FROM business LEFT JOIN user_has_business ON (business.bid=user_has_business.bid) LEFT JOIN users ON (users.uid=user_has_business.uid) OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		text: 'SELECT * FROM transactions WHERE bid=$1 OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [bid, start, end]
	}
	const client = await pool.connect();
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data('Unauthorized!', undefined);
				break;
			default:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data("Can't Find any Transactions!", undefined);
				}
				else {
					return new data(undefined, res.rows);
				}
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	return new data('Failed to get Transactions!', '');
}
async function addTransaction(asker, transaction) {
	const query = {
		text: 'CALL insert_transaction($1, $2, $3, $4, $5, $6, $7, $8)',
		values: [transaction.uid, transaction.bid, transaction.customer, transaction.date, transaction.product, transaction.payment, transaction.quantity, transaction.price]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.student:
				return new data('Students cannot add transactions!', undefined);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(undefined, 'Successfully Added Transaction!');
				break;
			case roleType.admin:
				await client.query(query);
				return new data(undefined, 'Successfully Added Transaction!');
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data("Error querying database!", undefined);
	}
	finally {
		client.release();
	}

	return new data('Failed to add Transaction!', undefined);
}



exports.init = init;
exports.getRole = getRole;
exports.createUser = createUser;
exports.getUserByUid = getUserByUid;
exports.getMultipleUsers = getMultipleUsers;
exports.modifyUser = modifyUser;
exports.deleteUserByUid = deleteUserByUid;

exports.getMultipleBusiness = getMultipleBusiness;
exports.createBusiness = createBusiness;

exports.getMultipleTransactions = getMultipleTransactions;
exports.addTransaction = addTransaction;

exports.data = data;
exports.asker = asker;
exports.user = user;
exports.roleType = roleType;
