import { API_PATH } from '../../../Config';

function userObject(user_id, role, first_name, last_name, section){
	return({
		user_id: user_id,
		role: role,
		first_name: first_name,
		last_name: last_name,
		section: section
	});
}

function companyObject(company_id, section, instructor){
	return({
		company_id: company_id,
		section: section,
		instructor: instructor
	});
}

function depositObject(company_id, user_id, value, date, description){
	return({
		company_id: company_id,
		user_id: user_id,
		value: value,
		date: date,
		description: description
	});
}

function transactionObject(company_id, user_id, customer, product, payment_method, quantity, price_per_unit, date){
	return({
		company_id: company_id,
		user_id: user_id,
		customer: customer,
		product: product,
		payment_method: payment_method,
		quantity: quantity,
		price_per_unit: price_per_unit,
		date: date
	});
}

function expenseObject(company_id, user_id, customer, product, payment_method, quantity, company, date, price_per_unit, description){
	return({
		company_id: company_id,
		user_id: user_id,
		customer: customer,
		product: product,
		payment_method: payment_method,
		quantity: quantity,
		company: company,
		date: date,
		price_per_unit: price_per_unit,
		description: description
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
let companyList = [];
let userList = [];
let depositList = [];
let transactionList = [];
let expenseList = [];

let companyIndex = 0;
let userIndex = 0;
let depositIndex = 0;
let transactionIndex = 0;
let expenseIndex = 0;

const dataLength = 100;

let updateFunction;

export function startExport(callBack){
	companyList = [];
	userList = [];
	depositList = [];
	transactionList = [];
	expenseList = [];
	companyIndex = 0;
	userIndex = 0;
	depositIndex = 0;
	transactionIndex = 0;
	expenseIndex = 0;
	databaseBackupObject = null;
	updateFunction = callBack;
	getCompanies();
}

function getCompanies(){
	fetch(API_PATH + '/business?start=' + companyIndex + '&end=' + dataLength, {
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
		if (data.length !== 0){
			let tempCompanyList = data.map(company => companyObject(company.company_id, company.section, company.instructor));
			companyList = companyList.concat(tempCompanyList);
			companyIndex += dataLength;
			getCompanies();
		}
		else {
			getCompaniesSuccess();
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getCompaniesSuccess(){
	getUsers();
	updateFunction(10, 'Downloading Company Info');
}

function getUsers(){
	fetch(API_PATH + '/user?start=' + userIndex + '&end=' + dataLength, {
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
		if (data.length !== 0) {
			let tempUserList = data.map(user => userObject(user.user_id, user.role, user.first_name, user.last_name, user.section));
			userList = userList.concat(tempUserList);
			userIndex += dataLength;
			getUsers();
		}
		else {
			getUsersSuccess();
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getUsersSuccess(){
	getDeposits();
	updateFunction(20, 'Downloading User Info');
}

function getDeposits(){
	fetch(API_PATH + '/deposit?start=' + depositIndex + '&end=' + dataLength, {
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
		if (data.length !== 0) {
			let tempDepositList = data.map(deposit => depositObject(deposit.company_id, deposit.user_id, deposit.value, deposit.date, deposit.description));
			depositList = depositList.concat(tempDepositList);
			depositIndex += dataLength;
			console.log(data);
			getDeposits();
		}
		else {
			getDepositsSuccess();
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getDepositsSuccess(){
	getTransactions();
	updateFunction(50, 'Downloading Deposits');
}

function getTransactions(){
	fetch(API_PATH + '/transaction?start=' + transactionIndex + '&end=' + dataLength, {
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
		if (data.length !== 0) {
			let tempTransactionList = data.map(transaction => transactionObject(transaction.company_id, transaction.user_id, transaction.customer, transaction.product, transaction.payment_method, transaction.quantity, transaction.price_per_unit, transaction.date));
			transactionList = transactionList.concat(tempTransactionList);
			transactionIndex += dataLength;
			getTransactions();
		}
		else {
			getTransactionsSuccess();
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getTransactionsSuccess(){
	getExpenses();
	updateFunction(70, 'Downloading Transactions');
}

function getExpenses(){
	fetch(API_PATH + '/expense?start=' + expenseIndex + '&end=' + dataLength, {
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
		if (data.length !== 0) {
			let tempExpenseList = data.map(expense => expenseObject(expense.company_id, expense.user_id, expense.customer, expense.product, expense.payment_method, expense.quantity, expense.company, expense.date, expense.price_per_unit, expense.description));
			expenseList = expenseList.concat(tempExpenseList);
			expenseIndex += dataLength;
			getExpenses();
		}
		else {
			getExpensesSuccess();
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getExpensesSuccess(){
	updateFunction( 100, 'Export Download Complete!');
	triggerDownload();
}

function triggerDownload(){

	databaseBackupObject = { companies: companyList , users: userList, deposits: depositList, transactions: transactionList, expenses: expenseList };

	//Create a CSV Download link
	let downloadLink = document.createElement("a");
	const blob = new Blob([JSON.stringify(databaseBackupObject, null, 2)], {type : 'application/json'});
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = "New.ftbac";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
