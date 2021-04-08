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
		text: 'SELECT first, last, users.uid, role, business.bid, name, section FROM "users" LEFT JOIN "user_has_business" ON users.uid = user_has_business.uid LEFT JOIN "business" ON user_has_business.bid = business.bid OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
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
async function addUserToBusiness(asker, uid, bid) {
	const query = {
		text: 'INSERT INTO user_has_business (uid, bid) VALUES ($1, $2)',
		values: [uid, bid]
	}
	const client = await pool.connect();
	try {
		switch(asker.role){
			case roleType.admin:
				if (await get_bid_from_uid(uid, client) == -1){
					await client.query(query);
					return new data(201);
				} else {
					return new data(409);
				}

				break;
			case roleType.instructor:
				if (await get_bid_from_uid(uid, client) == -1){
					await client.query(query);
					return new data(201);
				} else {
					return new data(409);
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

//Helper
async function get_bid_from_uid(uid, client) {
	const query = {
		text: 'SELECT bid FROM user_has_business WHERE uid = $1',
		values: [uid]
	};

	let res = await client.query(query);
	if (!res.rows.length) {
		return -1;
	}
	else {
		return res.rows[0].bid;
	}
}
async function is_user_in_business(uid, client, bid = null) {
	if (bid == null){
		bid = await get_bid_from_uid(uid, client);
		if (bid < 0){
			return false;
		}

		const query = {
			text: 'SELECT uid FROM user_has_business WHERE bid = $1 AND uid = $2',
			values: [bid, uid]
		};

		let res = await client.query(query);
		if (!res.rows.length) {
			return false;
		}
		else {
			return true;
		}
	}
	else {
		if (bid < 0){
			return false;
		}
		const query = {
			text: 'SELECT uid FROM user_has_business WHERE bid = $1 AND uid = $2',
			values: [bid, uid]
		};

		let res = await client.query(query);
		if (!res.rows.length) {
			return false;
		}
		else {
			return true;
		}
	}
}

//Business Queries
//name, instructor, section, revenue, bank, square, expenses, profit
async function getMultipleBusiness(asker, start, end) {
	const query = {
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
async function getBusinessByUid(asker) {
	const query = {
		text: 'SELECT * FROM business LEFT JOIN user_has_business ON (business.bid=user_has_business.bid) WHERE uid=$1;',
		values: [asker.uid]
	}
	const client = await pool.connect();
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			case roleType.instructor:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			case roleType.admin:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			default:
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

	return new data(500);
}
async function getBusinessByBid(asker, bid) {
	const query = {
		text: 'SELECT * FROM business WHERE bid=$1;',
		values: [bid]
	}
	const client = await pool.connect();
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				const studentIsInBusiness = await is_user_in_business(asker.uid, client, bid);
				if (studentIsInBusiness){
					res = await client.query(query);
					if (!res.rows.length) {
						return new data(404);
					}
					else {
						return new data(200, res.rows);
					}
				}
				else{
					return new data(403);
				}
			case roleType.instructor:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			case roleType.admin:
				res = await client.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			default:
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
				if (await is_user_in_business(asker.uid, client)) {
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
async function getMultipleTransactionsByUid(asker, start, end) {
	const client = await pool.connect();
	const bid = await get_bid_from_uid(asker.uid, client);
	if (bid == -1){
		return new data(403);
	}
	const query = {
		//text: 'SELECT name, section, transaction_total, bank_total, expense_total, profit, first, last FROM business LEFT JOIN user_has_business ON (business.bid=user_has_business.bid) LEFT JOIN users ON (users.uid=user_has_business.uid) OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		text: 'SELECT * FROM transactions WHERE bid=$1 OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [bid, start, end]
	}
	let res;
	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid, client)) {
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
				break;
			default:
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

	return new data(500);
}
async function addTransaction(asker, transaction) {
	const client = await pool.connect();
	const bid = await get_bid_from_uid(asker.uid, client);
	if (bid == -1){
		return new data(403);
	}
	const query = {
		text: 'CALL insert_transaction($1, $2, $3, $4, $5, $6, $7, $8)',
		values: [asker.uid, bid, transaction.customer, transaction.date, transaction.product, transaction.payment_method, transaction.quantity, transaction.price_per_unit]
	};

	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid, client)) {
					await client.query(query);
					return new data(201);
				}
				else {
					return new data(403);
				}
				break;
			case roleType.instructor:
				return new data(403);
				break;
			case roleType.admin:
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
async function deleteTransactionByTid(asker, tid, bid) {
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
				if (await is_user_in_business(asker.uid, client)) {
					await client.query(query);
					return new data(200);
				}
				else {
					return new data(403);
				}
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
				if (await is_user_in_business(asker.uid, client)) {
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
async function getMultipleExpensesByUid(asker, start, end) {
	const client = await pool.connect();
	const bid = await get_bid_from_uid(asker.uid, client);
	if (bid == -1){
		return new data(403);
	}
	const query = {
		text: 'SELECT * FROM expenses WHERE bid=$1 OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [bid, start, end]
	}
	let res;
	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid, client)) {
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
				break;
			default:
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

	return new data(500);
}
async function addExpense(asker, expense) {
	const client = await pool.connect();
	const bid = await get_bid_from_uid(asker.uid, client);
	if (bid == -1){
		return new data(403);
	}
	const query = {
		text: 'CALL insert_expense($1, $2, $3, $4, $5, $6, $7, $8, $9)',
		values: [asker.uid, bid, expense.product, expense.company, expense.quantity, expense.date, expense.payment_method, expense.price_per_unit, expense.justification]
	}

	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid, client)) {
					await client.query(query);
					return new data(201);
				}
				else {
					return new data(403);
				}
				break;
			case roleType.instructor:
				return new data(403);
				break;
			case roleType.admin:
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
async function deleteExpenseByEid(asker, eid, bid) {
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
			if (await is_user_in_business(asker.uid, client)) {
				await client.query(query);
				return new data(200);
			}
			else {
				return new data(403);
			}
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

//Export functions
async function getExpenseDataCSV(asker, bid) {
	const query = {
		text: 'SELECT * FROM expenses WHERE bid=$1;',
		values: [bid]
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
					const items = res.rows;
					const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
					const header = Object.keys(items[0]);
					const csv = [
					  header.join(','), // header row first
					  ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
					].join('\r\n');
					console.log(csv);
					return new data(200, csv);
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
async function getTransactionDataCSV(asker, bid) {
	const query = {
		text: 'SELECT * FROM transactions WHERE bid=$1;',
		values: [bid]
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
					const items = res.rows;
					const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
					const header = Object.keys(items[0]);
					const csv = [
					  header.join(','), // header row first
					  ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
					].join('\r\n');
					console.log(csv);
					return new data(200, csv);
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

exports.init = init;
exports.getRole = getRole;
exports.createUser = createUser;
exports.getUserByUid = getUserByUid;
exports.getMultipleUsers = getMultipleUsers;
exports.modifyUser = modifyUser;
exports.deleteUserByUid = deleteUserByUid;
exports.addUserToBusiness = addUserToBusiness;

exports.getMultipleBusiness = getMultipleBusiness;
exports.getBusinessByUid = getBusinessByUid;
exports.getBusinessByBid = getBusinessByBid;
exports.createBusiness = createBusiness;
exports.deleteBusinessByBid = deleteBusinessByBid;

exports.getMultipleTransactions = getMultipleTransactions;
exports.getMultipleTransactionsByUid = getMultipleTransactionsByUid;
exports.addTransaction = addTransaction;
exports.deleteTransactionByTid = deleteTransactionByTid;

exports.getMultipleExpenses = getMultipleExpenses;
exports.getMultipleExpensesByUid = getMultipleExpensesByUid;
exports.addExpense = addExpense;
exports.deleteExpenseByEid = deleteExpenseByEid;

exports.getMultipleDeposits = getMultipleDeposits;
exports.addDeposit = addDeposit;
exports.deleteDepositByDid = deleteDepositByDid;

exports.getExpenseDataCSV = getExpenseDataCSV;
exports.getTransactionDataCSV = getTransactionDataCSV;

exports.data = data;
exports.asker = asker;
exports.user = user;
exports.roleType = roleType;
