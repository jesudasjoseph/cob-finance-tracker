const { Pool } = require('pg');
const pool = new Pool();
const config = require('./config');
const logger = require('./logger.js');

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

let resetCode;

async function init(){
	pool.on('error', (err, client) => {
		logger.log(`Unexpected error on idle client: ${err}`, 'pg-error')
		process.exit(-1);
	})
}

//Development Queries
//Create Dev User (Only used if .env DEV_MODE == true)
async function addDevUser(user_id) {
	const createUserQuery = {
		text: 'INSERT INTO user_table (user_id, role, first_name, last_name, section) VALUES ($1, $2, $3, $4, $5)',
		values: [user_id, '2', 'Dev', 'Team', '000']
	}

	try {
		await pool.query(createUserQuery);
		return new data(201);
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
//Delete Dev User (Only used if .env DEV_MODE == false) 
async function deleteDevUser(user_id) {
	const query = {
		text: 'DELETE FROM user_table WHERE user_id = $1',
		values: [user_id]
	}

	try {
		await pool.query(query);
		return new data(200);
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}

//Database management
async function generateResetCode() {
	let firstHalf = [
		'banana',
		'orange',
		'mango',
		'peach',
		'watermelon'
	]
	let secondHalf = [
		'spinach',
		'carrot',
		'peas',
		'onion',
		'tomato'
	]
	let code = firstHalf[Math.floor(Math.random() * 5)] + '-' + secondHalf[Math.floor(Math.random() * 5)];
	resetCode = code;
	return code;
}
async function getResetCode(asker) {
	switch(asker.role){
		case roleType.student:
			return new data(403);
			break;
		case roleType.instructor:
		case roleType.admin:
			let res = await generateResetCode();
			return new data(200, {code: res});
		default:
			return new data(403);
	}
}
async function resetDatabase(asker, code){
	const deleteCompanyQuery = {
		text: 'DELETE FROM company_table'
	}
	const deleteUserQuery = {
		text: 'DELETE FROM user_table WHERE user_id!=$1',
		values: [asker.uid]
	}
	const client = await pool.connect();

	try {
		switch(asker.role){
			case roleType.admin:
			case roleType.instructor:
				if (code === resetCode){
					await client.query(deleteCompanyQuery);
					await client.query(deleteUserQuery);
					return new data(200);
				}
				else{
					return new data(406);
				}
				break;
			case roleType.student:
				return new data(403);
				break;
			default:
				return new data(403);
		}
	} catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	} finally {
		client.release();
	}
	return new data(500);
}

//Helper
async function get_bid_from_uid(user_id) {
	const query = {
		text: 'SELECT company_id FROM user_has_company WHERE user_id = $1',
		values: [user_id]
	};

	let res = await pool.query(query);
	if (!res.rows.length) {
		return -1;
	}
	else {
		return res.rows[0].company_id;
	}
}
async function is_user_in_business(user_id, company_id = null) {
	if (company_id == null){
		company_id = await get_bid_from_uid(user_id);
		if (company_id < 0){
			return false;
		}

		const query = {
			text: 'SELECT user_id FROM user_has_company WHERE company_id = $1 AND user_id = $2',
			values: [company_id, user_id]
		};

		let res = await pool.query(query);
		if (!res.rows.length) {
			return false;
		}
		else {
			return true;
		}
	}
	else {
		if (company_id < 0){
			return false;
		}
		const query = {
			text: 'SELECT user_id FROM user_has_company WHERE company_id = $1 AND user_id = $2',
			values: [company_id, user_id]
		};

		let res = await pool.query(query);
		if (!res.rows.length) {
			return false;
		}
		else {
			return true;
		}
	}
}

//This is a model function
async function createUser(asker, user) {
	const createUserQuery = {
		text: 'INSERT INTO user_table (user_id, role, first_name, last_name, section) VALUES ($1, $2, $3, $4, $5)',
		values: [user.user_id, user.role, user.first_name, user.last_name, user.section]
	}

	try {
		switch(asker.role){
			case roleType.admin:
				await pool.query(createUserQuery);
				return new data(201);
				break;
			case roleType.instructor:
				if (user.role != roleType.admin){
					await pool.query(createUserQuery);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getUserByUid(asker, user_id) {
	const query = {
		text: 'SELECT * FROM user_table WHERE user_id = $1',
		values: [user_id]
	}
	let res;

	try {
		if (asker.uid === user_id || asker.role >= 1){
			res = await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}
}
async function getUserByAsker(asker) {
	return new data(200, {uid:asker.uid});
}
//Permissions Instructor, Admin
async function getMultipleUsersByBid(asker, company_id) {
	const query = {
		text: 'SELECT user_table.first_name, user_table.last_name, user_table.user_id, user_table.role, user_table.section FROM user_table LEFT JOIN "user_has_company" ON user_table.user_id = user_has_company.user_id LEFT JOIN company_table ON user_has_company.company_id = company_table.company_id WHERE company_table.company_id=$1 ORDER BY user_table.user_id',
		values: [company_id]
	}
	let res;

	try {
		switch (asker.role){
			case 0:
				return new data(403);
				break;
			case 1:
				res = await pool.query(query);
				break;
			case 2:
				res = await pool.query(query);
				break;
			default:
				return new data(403);
		}
		if (!res.rows.length) {
			return new data(200, []);
		}
		else {
			return new data(200, res.rows);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}
}
async function getMultipleUsers(asker, start, end, sort, searchText) {
	searchText = '%' + searchText + '%';
	const querySortByOnid = {
		text: 'SELECT first_name, last_name, user_table.user_id, role, company_table.company_id, user_table.section FROM "user_table" LEFT JOIN "user_has_company" ON user_table.user_id = user_has_company.user_id LEFT JOIN company_table ON user_has_company.company_id = company_table.company_id WHERE user_table.user_id ILIKE $3 OR user_table.first_name ILIKE $3 OR user_table.last_name ILIKE $3 ORDER BY user_table.user_id OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
		values: [start, end, searchText]
	}
	const querySortByBusinessName = {
		text: 'SELECT first_name, last_name, user_table.user_id, role, company_table.company_id, user_table.section FROM "user_table" LEFT JOIN "user_has_company" ON user_table.user_id = user_has_company.user_id LEFT JOIN company_table ON user_has_company.company_id = company_table.company_id WHERE user_table.user_id ILIKE $3 OR user_table.first_name ILIKE $3 OR user_table.last_name ILIKE $3 ORDER BY company_table.company_id OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
		values: [start, end, searchText]
	}
	const querySortByLastName = {
		text: 'SELECT first_name, last_name, user_table.user_id, role, company_table.company_id, user_table.section FROM "user_table" LEFT JOIN "user_has_company" ON user_table.user_id = user_has_company.user_id LEFT JOIN company_table ON user_has_company.company_id = company_table.company_id WHERE user_table.user_id ILIKE $3 OR user_table.first_name ILIKE $3 OR user_table.last_name ILIKE $3 ORDER BY user_table.last_name OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
		values: [start, end, searchText]
	}
	const querySortByFirstName = {
		text: 'SELECT first_name, last_name, user_table.user_id, role, company_table.company_id, user_table.section FROM "user_table" LEFT JOIN "user_has_company" ON user_table.user_id = user_has_company.user_id LEFT JOIN company_table ON user_has_company.company_id = company_table.company_id WHERE user_table.user_id ILIKE $3 OR user_table.first_name ILIKE $3 OR user_table.last_name ILIKE $3 ORDER BY user_table.first_name OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
		values: [start, end, searchText]
	}
	const querySortByRole = {
		text: 'SELECT first_name, last_name, user_table.user_id, role, company_table.company_id, user_table.section FROM "user_table" LEFT JOIN "user_has_company" ON user_table.user_id = user_has_company.user_id LEFT JOIN company_table ON user_has_company.company_id = company_table.company_id WHERE user_table.user_id ILIKE $3 OR user_table.first_name ILIKE $3 OR user_table.last_name ILIKE $3 ORDER BY user_table.role, user_table.last_name OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY',
		values: [start, end, searchText]
	}
	let res;

	try {
		if (asker.role >= 1){
			switch (sort){
				case 'onid':
					res = await pool.query(querySortByOnid);
					break;
				case 'businessname':
					res = await pool.query(querySortByBusinessName);
					break;
				case 'first':
					res = await pool.query(querySortByFirstName);
					break;
				case 'last':
					res = await pool.query(querySortByLastName);
					break;
				case 'role':
					res = await pool.query(querySortByRole);
					break;
				default:
					res = await pool.query(querySortByRole);
					break;
			}
			if (!res.rows.length) {
				return new data(200, []);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}
}
async function getInstructors() {
	const query = {
		text: 'SELECT * FROM user_table WHERE role>0'
	}
	let res;

	try {
		res = await pool.query(query);
		if (!res.rows.length) {
			return new data(200, []);
		}
		else {
			return new data(200, res.rows);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}
}
async function modifyUser(asker, user) {
	const query = {
		text: 'UPDATE user_table SET first_name = $1, last_name = $2 WHERE user_id=$3',
		values: [user.first, user.last, user.uid]
	}
	let res;

	try {
		if (asker.uid === user.uid || asker.role >= 1){
			res = await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}
}
async function deleteUserByUid(asker, user_id) {
	const query = {
		text: 'DELETE FROM user_table WHERE user_id = $1',
		values: [user_id]
	}

	try {
		switch(asker.role){
			case roleType.admin:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				if (user.role != roleType.admin){
					await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getRole(asker){
	let res;
	try {
		res = await pool.query('SELECT role FROM user_table WHERE user_id = $1', [asker.uid]);
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	if (!res.rows.length) {
		return new data(200, []);
	}
	else {
		return new data(200, res.rows[0].role);
	}
}
async function addUserToBusiness(asker, user_id, company_id) {
	const deleteQuery = {
		text: 'DELETE FROM user_has_company WHERE user_id=$1',
		values: [user_id]
	}
	const query = {
		text: 'INSERT INTO user_has_company (user_id, company_id) VALUES ($1, $2)',
		values: [user_id, company_id]
	}

	const client = await pool.connect();
	try {
		switch(asker.role){
			case roleType.admin:
				await client.query(deleteQuery);
				await client.query(query);
				return new data(201);

				break;
			case roleType.instructor:
				await client.query(deleteQuery);
				await client.query(query);
				return new data(201);

				break;
			case roleType.student:
				return new data(403);
				break;
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}

//Business Queries
//name, instructor, section, revenue, bank, square, expenses, profit
async function getMultipleBusiness(asker, start, end, sort, searchText) {
	searchText = '%' + searchText + '%';
	const query = {
		text: 'SELECT * FROM company_view WHERE company_view.company_id ILIKE $3 OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end, searchText]
	}
	const querySortByInstructor = {
		text: 'SELECT * FROM company_view WHERE company_view.company_id ILIKE $3 ORDER BY instructor OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end, searchText]
	}
	const querySortByName = {
		text: 'SELECT * FROM company_view WHERE company_view.company_id ILIKE $3 ORDER BY company_id OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end, searchText]
	}
	const querySortBySection = {
		text: 'SELECT * FROM company_view WHERE company_view.company_id ILIKE $3 ORDER BY section OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end, searchText]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			default:
				switch (sort){
					case 'instructor':
						res = await pool.query(querySortByInstructor);
						break;
					case 'name':
						res = await pool.query(querySortByName);
						break;
					case 'section':
						res = await pool.query(querySortBySection);
						break;
					default:
						res = await pool.query(query);
						break;
				}
				if (!res.rows.length) {
					return new data(200, []);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getMultipleBusinessNames(asker) {
	const query = {
		text: "SELECT company_id FROM company_view ORDER BY company_id;"
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			default:
				res = await pool.query(query);

			if (!res.rows.length) {
				return new data(200, []);
			}
			else {
				return new data(200, res.rows);
			}
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getBusinessByUid(asker) {
	const query = {
		text: 'SELECT * FROM company_view LEFT JOIN user_has_company ON (company_view.company_id=user_has_company.company_id) WHERE user_id=$1;',
		values: [asker.uid]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			case roleType.instructor:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			case roleType.admin:
				res = await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getBusinessByBid(asker, company_id) {
	const query = {
		text: 'SELECT * FROM company_view WHERE company_id=$1;',
		values: [company_id]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				const studentIsInBusiness = await is_user_in_business(asker.uid, company_id);
				if (studentIsInBusiness){
					res = await pool.query(query);
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
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(404);
				}
				else {
					return new data(200, res.rows);
				}
			case roleType.admin:
				res = await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function createBusiness(asker, company) {
	const query = {
		text: 'INSERT INTO company_table (company_id, section, instructor) VALUES ($1, $2, $3)',
		values: [company.company_id, company.section, company.instructor]
	}

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
				await pool.query(query);
				return new data(201);
				break;
			case roleType.admin:
				await pool.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function modifyProfitGoalByUid(asker, profit_goal) {
	const query = {
		text: 'UPDATE company_table SET profit_goal=$1 FROM user_has_company WHERE company_table.company_id=user_has_company.company_id AND user_id=$2;',
		values: [profit_goal, asker.uid]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				await pool.query(query);
				return new data(200);
			case roleType.instructor:
				return new data(403);
			case roleType.admin:
				return new data(403);
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function modifyStretchProfitGoalByUid(asker, stretch_profit_goal) {
	const query = {
		text: 'UPDATE company_table SET stretch_profit_goal=$1 FROM user_has_company WHERE company_table.company_id=user_has_company.company_id AND user_id=$2;',
		values: [stretch_profit_goal, asker.uid]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				await pool.query(query);
				return new data(200);
			case roleType.instructor:
				return new data(403);
			case roleType.admin:
				return new data(403);
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function deleteBusinessByBid(asker, company_id) {
	const query = {
		text: 'DELETE FROM company_table WHERE company_id = $1',
		values: [company_id]
	}

	try {
		switch(asker.role){
			case roleType.admin:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	} catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	} finally {
	}
	return new data(500);
}

//Transaction Queries
//Fix permissions for students
async function getMultipleTransactionsByBid(asker, start, end, company_id) {
	const query = {
		text: 'SELECT * FROM transaction_table WHERE company_id=$1 ORDER BY date DESC OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [company_id, start, end]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					res = await pool.query(query);
					if (!res.rows.length) {
						return new data(200, res.rows);
					}
					else {
						return new data(200, res.rows);
					}
				}
				else {
					return new data(403);
				}
				break;
			case roleType.instructor:
			case roleType.admin:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(200, []);
				}
				else {
					return new data(200, res.rows);
				}
				break;
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getMultipleTransactions(asker, start, end) {
	const query = {
		text: 'SELECT * FROM transaction_table ORDER BY date DESC OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403)
				break;
			case roleType.instructor:
			case roleType.admin:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(200, []);
				}
				else {
					return new data(200, res.rows);
				}
				break;
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getMultipleTransactionsByUid(asker, start, end, searchText) {
	searchText = '%' + searchText + '%';
	const company_id = await get_bid_from_uid(asker.uid);
	if (company_id == -1){
		return new data(404);
	}
	const query = {
		text: 'SELECT * FROM transaction_table WHERE company_id=$1 AND transaction_table.date::text ILIKE $4 ORDER BY date DESC OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [company_id, start, end, searchText]
	}
	let res;
	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					res = await pool.query(query);
					if (!res.rows.length) {
						return new data(200, []);
					}
					else {
						return new data(200, res.rows);
					}
				}
				else {
					return new data(404);
				}
				break;
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function addTransaction(asker, transaction) {
	const company_id = await get_bid_from_uid(asker.uid);
	if (company_id == -1){
		return new data(403);
	}
	const query = {
		text: "CALL insert_transaction($1, $2, $3, $4, $5, $6, $7, $8)",
		values: [asker.uid, company_id, transaction.customer, transaction.product, transaction.date, transaction.payment_method, transaction.quantity, transaction.price_per_unit]
	};

	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function addTransactionByCid(asker, transaction) {
	const query = {
		text: 'CALL insert_transaction($1, $2, $3, $4, $5, $6, $7, $8)',
		values: [transaction.user_id, transaction.company_id, transaction.customer, transaction.product, transaction.date, transaction.payment_method, transaction.quantity, transaction.price_per_unit]
	};

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
			case roleType.admin:
				await pool.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function deleteTransactionByTid(asker, transaction_id, company_id) {
	const query = {
		text: 'CALL delete_transaction($1)',
		values: [transaction_id]
	}

	try {
		switch(asker.role){
			case roleType.admin:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					await pool.query(query);
					return new data(200);
				}
				else {
					return new data(403);
				}
				break;
		}
	} catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	} finally {
	}
	return new data(500);
}

//Expense Queries
//Fix Permissions for students
async function getMultipleExpensesByBid(asker, start, end, company_id) {
	const query = {
		text: 'SELECT * FROM expense_table WHERE company_id=$1 ORDER BY date DESC OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [company_id, start, end]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					res = await pool.query(query);
					if (!res.rows.length) {
						return new data(200, []);
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
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(200, []);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getMultipleExpenses(asker, start, end) {
	const query = {
		text: 'SELECT * FROM expense_table ORDER BY date DESC OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
			case roleType.admin:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(404, res.rows);
				}
				else {
					return new data(200, res.rows);
				}
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getMultipleExpensesByUid(asker, start, end, searchText) {
	searchText = '%' + searchText + '%';
	const company_id = await get_bid_from_uid(asker.uid);
	if (company_id == -1){
		return new data(404);
	}
	const query = {
		text: 'SELECT * FROM expense_table WHERE company_id=$1 AND expense_table.date::text ILIKE $4 ORDER BY date DESC OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [company_id, start, end, searchText]
	}
	let res;
	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					res = await pool.query(query);
					if (!res.rows.length) {
						return new data(200, []);
					}
					else {
						return new data(200, res.rows);
					}
				}
				else {
					return new data(404);
				}
				break;
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function addExpense(asker, expense) {
	const company_id = await get_bid_from_uid(asker.uid);
	if (company_id == -1){
		return new data(403);
	}
	const query = {
		text: 'CALL insert_expense($1, $2, $3, $4, $5, $6, $7, $8, $9)',
		values: [asker.uid, company_id, expense.product, expense.company, expense.quantity, expense.date, expense.payment_method, expense.price_per_unit, expense.description]
	}

	try {
		switch(asker.role){
			case roleType.student:
				if (await is_user_in_business(asker.uid)) {
					await pool.query(query);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function addExpenseByCid(asker, expense) {
	const query = {
		text: 'CALL insert_expense($1, $2, $3, $4, $5, $6, $7, $8, $9)',
		values: [expense.user_id, expense.company_id, expense.product, expense.company, expense.quantity, expense.date, expense.payment_method, expense.price_per_unit, expense.description]
	}

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
			case roleType.admin:
				await pool.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function deleteExpenseByEid(asker, expense_id, company_id) {
	const query = {
		text: 'CALL delete_expense($1)',
		values: [expense_id]
	}

	try {
		switch(asker.role){
			case roleType.admin:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.student:
			if (await is_user_in_business(asker.uid, company_id)) {
				await pool.query(query);
				return new data(200);
			}
			else {
				return new data(403);
			}
				break;
		}
	} catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	} finally {
	}
	return new data(500);
}

//Deposit Queries
//Permitted - Admin, Instructor
async function getMultipleDepositsByBid(asker, start, end, company_id, searchText) {
	searchText = '%' + searchText + '%';
	const query = {
		text: 'SELECT * FROM deposit_table WHERE company_id=$1 AND deposit_table.date::text ILIKE $4 ORDER BY date DESC OFFSET ($2) ROWS FETCH FIRST ($3) ROWS ONLY;',
		values: [company_id, start, end, searchText]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			default:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(200, []);
				}
				else {
					return new data(200, res.rows);
				}
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function getMultipleDeposits(asker, start, end) {
	const query = {
		text: 'SELECT * FROM deposit_table ORDER BY date DESC OFFSET ($1) ROWS FETCH FIRST ($2) ROWS ONLY;',
		values: [start, end]
	}
	let res;

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
			case roleType.admin:
				res = await pool.query(query);
				if (!res.rows.length) {
					return new data(404, res.rows);
				}
				else {
					return new data(200, res.rows);
				}
			default:
				return new data(403);
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function addDeposit(asker, deposit) {
	const query = {
		text: 'CALL insert_deposit($1, $2, $3, $4)',
		values: [deposit.company_id, deposit.user_id, deposit.value, deposit.description]
	}

	try {
		switch(asker.role){
			case roleType.student:
				return new data(403);
				break;
			case roleType.instructor:
				await pool.query(query);
				return new data(201);
				break;
			case roleType.admin:
				await pool.query(query);
				return new data(201);
				break;
		}
	}
	catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
	}

	return new data(500);
}
async function deleteDepositByDid(asker, deposit_id) {
	const query = {
		text: 'CALL delete_deposit($1)',
		values: [deposit_id]
	}

	try {
		switch(asker.role){
			case roleType.admin:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.instructor:
				await pool.query(query);
				return new data(200);
				break;
			case roleType.student:
				return new data(403);
				break;
		}
	} catch (e) {
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	} finally {

	}
	return new data(500);
}

//Export functions
async function getExpenseDataCSV(asker, company_id) {
	const query = {
		text: 'SELECT * FROM expense_table WHERE company_id=$1;',
		values: [company_id]
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
					return new data(200, []);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function getTransactionDataCSV(asker, company_id) {
	const query = {
		text: 'SELECT * FROM transaction_table WHERE company_id=$1;',
		values: [company_id]
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
					return new data(200, []);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}
async function getDepositDataCSV(asker, company_id) {
	const query = {
		text: 'SELECT * FROM deposit_table WHERE company_id=$1;',
		values: [company_id]
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
					return new data(200, []);
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
		logger.log(e.toString(), 'pg-error');
		return new data(500);
	}
	finally {
		client.release();
	}

	return new data(500);
}

exports.init = init;

exports.addDevUser = addDevUser;
exports.deleteDevUser = deleteDevUser;

exports.getRole = getRole;

exports.getResetCode = getResetCode;
exports.resetDatabase = resetDatabase;

exports.createUser = createUser;
exports.getUserByUid = getUserByUid;
exports.getUserByAsker = getUserByAsker;
exports.getMultipleUsersByBid = getMultipleUsersByBid;
exports.getMultipleUsers = getMultipleUsers;
exports.getInstructors = getInstructors;
exports.modifyUser = modifyUser;
exports.deleteUserByUid = deleteUserByUid;
exports.addUserToBusiness = addUserToBusiness;

exports.getMultipleBusiness = getMultipleBusiness;
exports.getMultipleBusinessNames = getMultipleBusinessNames;
exports.getBusinessByUid = getBusinessByUid;
exports.getBusinessByBid = getBusinessByBid;
exports.createBusiness = createBusiness;
exports.modifyProfitGoalByUid = modifyProfitGoalByUid;
exports.modifyStretchProfitGoalByUid = modifyStretchProfitGoalByUid;
exports.deleteBusinessByBid = deleteBusinessByBid;

exports.getMultipleTransactions = getMultipleTransactions;
exports.getMultipleTransactionsByBid = getMultipleTransactionsByBid;
exports.getMultipleTransactionsByUid = getMultipleTransactionsByUid;
exports.addTransaction = addTransaction;
exports.addTransactionByCid = addTransactionByCid;
exports.deleteTransactionByTid = deleteTransactionByTid;

exports.getMultipleExpenses = getMultipleExpenses;
exports.getMultipleExpensesByBid = getMultipleExpensesByBid;
exports.getMultipleExpensesByUid = getMultipleExpensesByUid;
exports.addExpense = addExpense;
exports.addExpenseByCid = addExpenseByCid;
exports.deleteExpenseByEid = deleteExpenseByEid;

exports.getMultipleDeposits = getMultipleDeposits;
exports.getMultipleDepositsByBid = getMultipleDepositsByBid;
exports.addDeposit = addDeposit;
exports.deleteDepositByDid = deleteDepositByDid;

exports.getExpenseDataCSV = getExpenseDataCSV;
exports.getTransactionDataCSV = getTransactionDataCSV;
exports.getDepositDataCSV = getDepositDataCSV;

exports.data = data;
exports.asker = asker;
exports.user = user;
exports.roleType = roleType;
