const { Pool } = require('pg');

const pool = new Pool();

const roleType = {
	'admin':2,
	'instructor':1,
	'student':0
};

function data(code, data = null){
	this.code = code;
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
				return new data(201);
				break;
			case roleType.instructor:
				if (user.role != roleType.admin){
					await client.query(createUserQuery);
					return new data(201);
				}
				else {
					return new data(403);
				}
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
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
				return new data(404);
			}
			else {
				return new data(200, res.rows[0]);
			}
		}
		else {
			return new data(403);
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
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
				return new data(404);
			}
			else {
				return new data(200, res.rows);
			}
		}
		else {
			return new data(403);
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
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
				return new data(404);
			}
			else {
				return new data(200);
			}
		}
		else {
			return new data(403);
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
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
				return new data(200);
				break;
			case roleType.instructor:
				if (user.role != roleType.admin){
					await client.query(query);
					return new data(200);
				}
				else {
					return new data(403);
				}
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function getRole(asker){
	const client = await pool.connect();
	let res;
	try {
		res = await client.query('SELECT role FROM "users" WHERE uid = $1', [asker.uid]);
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	if (!res.rows.length) {
		return new data(404);
	}
	else {
		return new data(200, res.rows[0].role);
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
				return new data(403);
				break;
			default:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
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
				return new data(403);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(201);
				break;
			case roleType.admin:
				await client.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function deleteBusinessByBid(asker, bid) {
	const query = {
		text: 'DELETE FROM business WHERE bid = $1',
		values: [bid]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(200);
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	} catch (e) {
		console.log("pg" + e);
		return new data(500);
	} finally {
		client.release();
	}
	return new data(500);
}

//Transaction Queries
//Fix permissions for students
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
				return new data(403);
				break;
			default:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
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
				return new data(403);//Students cant add transactions yet.. (need to change)
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(201);
				break;
			case roleType.admin:
				await client.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function deleteTransactionByTid(asker, tid) {
	const query = {
		text: 'CALL delete_transaction($1)',
		values: [tid]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(200);
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	} catch (e) {
		console.log("pg" + e);
		return new data(500);
	} finally {
		client.release();
	}
	return new data(500);
}

//Expense Queries
//Fix Permissions for students
async function getMultipleExpenses(asker, start, end, bid) {
	const query = {
		text: 'SELECT * FROM expenses WHERE bid=$1 OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [bid, start, end]
	}
	const client = await pool.connect();
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			default:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function addExpense(asker, expense) {
	const query = {
		text: 'CALL insert_expense($1, $2, $3, $4, $5, $6, $7, $8, $9)',
		values: [expense.uid, expense.bid, expense.product, expense.company, expense.quantity, expense.date, expense.payment, expense.price, expense.justification]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);//Students cant add transactions yet.. (need to change)
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(201);
				break;
			case roleType.admin:
				await client.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function deleteExpenseByEid(asker, eid) {
	const query = {
		text: 'CALL delete_expense($1)',
		values: [eid]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(200);
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	} catch (e) {
		console.log("pg" + e);
		return new data(500);
	} finally {
		client.release();
	}
	return new data(500);
}

//Deposit Queries
//Permitted - Admin, Instructor
async function getMultipleDeposits(asker, start, end, bid) {
	const query = {
		text: 'SELECT * FROM deposits WHERE bid=$1 OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [bid, start, end]
	}
	const client = await pool.connect();
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			default:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function addDeposit(asker, deposit) {
	const query = {
		text: 'CALL insert_deposit($1, $2, $3, $4)',
		values: [deposit.uid, deposit.bid, deposit.product, deposit.company]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(201);
				break;
			case roleType.admin:
				await client.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		console.log("pg" + e);
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function deleteDepositByDid(asker, did) {
	const query = {
		text: 'CALL delete_deposit($1)',
		values: [did]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await client.query(query);
				return new data(200);
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	} catch (e) {
		console.log("pg" + e);
		return new data(500);
	} finally {
		client.release();
	}
	return new data(500);
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
exports.deleteBusinessByBid = deleteBusinessByBid;

exports.getMultipleTransactions = getMultipleTransactions;
exports.addTransaction = addTransaction;
exports.deleteTransactionByTid = deleteTransactionByTid;

exports.getMultipleTransactions = getMultipleExpenses;
exports.addTransaction = addExpense;
exports.deleteExpenseByEid = deleteExpenseByEid;

exports.getMultipleDeposits = getMultipleDeposits;
exports.addDeposit = addDeposit;
exports.deleteDepositByDid = deleteDepositByDid;

exports.data = data;
exports.asker = asker;
exports.user = user;
exports.roleType = roleType;
