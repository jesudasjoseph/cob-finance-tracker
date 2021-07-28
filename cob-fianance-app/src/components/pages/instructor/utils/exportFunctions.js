import { API_PATH } from '../../../Config';

function userObject(uid, role, first, last, section){
	return({
		uid: uid,
		role: role,
		first: first,
		last: last,
		section: section
	});
}

function companyObject(bid, name, section, instructor){
	return({
		bid: bid,
		name: name,
		section: section,
		instructor: instructor
	});
}

function depositObject(bid, uid, val, tag, date, description){
	return({
		bid: bid,
		uid: uid,
		val: val,
		tag: tag,
		date: date,
		description: description
	});
}

function transactionObject(bid, uid, customer, product, payment_method, quantity, price_per_unit, date){
	return({
		bid: bid,
		uid: uid,
		customer: customer,
		product: product,
		payment_method: payment_method,
		quantity: quantity,
		price_per_unit: price_per_unit,
		date: date
	});
}

function expenseObject(bid, uid, customer, product, payment_method, quantity, company, date, price_per_unit, justification){
	return({
		bid: bid,
		uid: uid,
		customer: customer,
		product: product,
		payment_method: payment_method,
		quantity: quantity,
		company: company,
		date: date,
		price_per_unit: price_per_unit,
		justification: justification
	});
}

let databaseBackupObject;
/*
databaseBackupObject = {
	companies = [
		companyObject,
		companyObject,
		...
		],
	users = [
		userObject,
		userObject,
		...
		],
	deposits = [
		depositObject,
		depositObject,
		...
	],
	transactions = [
		transactionObject,
		transactionObject,
		...
	],
	expenses = [
		expenseObject,
		expenseObject,
		...
	]
}
*/

let updateFunction;

export function startExport(callBack){
	databaseBackupObject = { companies: [] , users: [], deposits: [], transactions: [], expenses: [] };
	updateFunction = callBack;
	getCompanies();
}

function getCompanies(){
	fetch(API_PATH + '/business?start=0&end=100', {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		getCompaniesSuccess(data);
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getCompaniesSuccess(data){
	databaseBackupObject.companies = data.map(company => companyObject(company.bid, company.name, company.section, company.instructor));
	getUsers();
	updateFunction(10, 'Downloading Company Info');
}

function getUsers(){
	fetch(API_PATH + '/user?start=0&end=100', {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		getUsersSuccess(data);
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getUsersSuccess(data){
	databaseBackupObject.users = data.map(user => userObject(user.uid, user.role, user.first, user.last, user.section));
	getDeposits();
	updateFunction(20, 'Downloading User Info');
}

function getDeposits(){
	fetch(API_PATH + '/deposit?start=0&end=100', {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		getDepositsSuccess(data);
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getDepositsSuccess(data){
	databaseBackupObject.deposits = data.map(deposit => depositObject(deposit.bid, deposit.uid, deposit.val, deposit.tag, deposit.date, deposit.description));
	getTransactions();
	updateFunction(50, 'Downloading Deposits');
}

function getTransactions(){
	fetch(API_PATH + '/transaction?start=0&end=100', {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		getTransactionsSuccess(data);
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getTransactionsSuccess(data){
	databaseBackupObject.transactions = data.map(transaction => transactionObject(transaction.bid, transaction.uid, transaction.customer, transaction.product, transaction.payment_method, transaction.quantity, transaction.price_per_unit, transaction.date));
	getExpenses();
	updateFunction(70, 'Downloading Transactions');
}

function getExpenses(){
	fetch(API_PATH + '/expense?start=0&end=100', {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		getExpensesSuccess(data);
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getExpensesSuccess(data){
	databaseBackupObject.expenses = data.map(expense => expenseObject(expense.bid, expense.uid, expense.customer, expense.product, expense.payment_method, expense.quantity, expense.company, expense.date, expense.price_per_unit, expense.justification));
	updateFunction( 100, 'Export Download Complete!');
	triggerDownload();
}

function triggerDownload(){
	//Create a CSV Download link
	let downloadLink = document.createElement("a");
	const blob = new Blob([JSON.stringify(databaseBackupObject, null, 2)], {type : 'application/json'});
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = "New.ftbac";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
