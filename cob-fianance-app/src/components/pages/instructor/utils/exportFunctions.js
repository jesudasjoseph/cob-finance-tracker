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
		instructor: instructor,
		users: [],
		deposits: [],
		transactions: [],
		expenses: []
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
	users = [
		userObject,
		userObject,
		...
	],
	companies = [
		companyObject,
		companyObject,
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

let companyIndex = 0;
let userIndex = 0;

const DATA_LENGTH = 100;

let updateFunction;

export function startExport(callBack){
	companyList = [];
	userList = [];
	companyIndex = 0;
	userIndex = 0;
	databaseBackupObject = null;
	updateFunction = callBack;
	getUsers();
}
function getUsers(){
	fetch(API_PATH + '/user?start=' + userIndex + '&end=' + DATA_LENGTH, {
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
			userIndex += DATA_LENGTH;
			console.log(data);
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
	updateFunction(20, 'Downloading User Info');
	getCompanies();
}

function getCompanies(){
	fetch(API_PATH + '/business?start=' + companyIndex + '&end=' + DATA_LENGTH, {
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
			companyIndex += DATA_LENGTH;
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
	updateFunction(10, 'Downloaded Company Info');
	if (companyList.length)
		companyList.forEach((item, i) => {
			getDeposits(i);
			getTransactions(i);
			getExpenses(i);
		});
	else
		triggerDownload();
}

function getDeposits(companyIndex, depositIndex = 0){
	console.log(`depositIndex: ${depositIndex}, companyIndex: ${companyIndex}`);
	fetch(API_PATH + '/deposit/bybid?bid=' + companyList[companyIndex].company_id + '&start=' + depositIndex + '&end=' + DATA_LENGTH, {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.length !== 0) {
			let tempDepositList = data.map(deposit => depositObject(deposit.company_id, deposit.user_id, deposit.value, deposit.date, deposit.description));
			companyList[companyIndex].deposits = companyList[companyIndex].deposits.concat(tempDepositList);
			getDeposits(companyIndex, depositIndex += DATA_LENGTH);
		}
		else {
			updateFunction(50, 'Downloading Deposits');
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getTransactions(companyIndex, transactionIndex = 0){
	console.log(`transactionIndex: ${transactionIndex}, companyIndex: ${companyIndex}`);
	fetch(API_PATH + '/transaction/bybid?bid=' + companyList[companyIndex].company_id + '&start=' + transactionIndex + '&end=' + DATA_LENGTH, {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.length) {
			let tempTransactionList = data.map(transaction => transactionObject(transaction.company_id, transaction.user_id, transaction.customer, transaction.product, transaction.payment_method, transaction.quantity, transaction.price_per_unit, transaction.date));
			companyList[companyIndex].transactions = companyList[companyIndex].transactions.concat(tempTransactionList);
			getTransactions(companyIndex, transactionIndex += DATA_LENGTH);
		}
		else {
			updateFunction(70, 'Downloading Transactions');
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getExpenses(companyIndex, expenseIndex = 0){
	fetch(API_PATH + '/expense/bybid?bid=' + companyList[companyIndex].company_id + '&start=' + expenseIndex + '&end=' + DATA_LENGTH, {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.length) {
			let tempExpenseList = data.map(expense => expenseObject(expense.company_id, expense.user_id, expense.customer, expense.product, expense.payment_method, expense.quantity, expense.company, expense.date, expense.price_per_unit, expense.description));
			companyList[companyIndex].expenses = companyList[companyIndex].expenses.concat(tempExpenseList);
			getExpenses(companyIndex, expenseIndex += DATA_LENGTH);
		}
		else {
			updateFunction( 100, 'Export Download Complete!');
			getUsersInCompany(companyIndex);
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}
function getUsersInCompany(companyIndex){
	fetch(API_PATH + '/user/bybid?bid=' + companyList[companyIndex].company_id, {
		mode: 'cors',
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Authorization': window.localStorage.getItem('jwt')
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.length !== 0){
			companyList[companyIndex].users = data.map(item => item.user_id);
		}
		if ((companyList.length - 1) === companyIndex){
			triggerDownload();
		}
	}).catch((error) => {
		console.error('Error:', error);
	});
}

function triggerDownload(){

	databaseBackupObject = { companies: companyList , users: userList };

	//Create a CSV Download link
	let downloadLink = document.createElement("a");
	const blob = new Blob([JSON.stringify(databaseBackupObject, null, 2)], {type : 'application/json'});
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = "New.ftbac";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
