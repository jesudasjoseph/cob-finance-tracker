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

let databaseBackup;
/*
databaseBackup = {
	companies = [
		companyObject,
		companyObject
		],
	users = [
		userObject,
		userObject
		],
	deposits = []
}
*/
let companyList;

export function startExport(callBack){
	databaseBackup = { companies: [] , users: [], deposits: [], transactions: [], expenses: [] };
	getCompanies();
	getUsers();
	callBack(100);
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
		databaseBackup.companies = data.map(company => companyObject(company.bid, company.name, company.section, company.instructor));
		console.log(databaseBackup);
	}).catch((error) => {
		console.error('Error:', error);
	});
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
		databaseBackup.users = data.map(user => userObject(user.uid, user.role, user.first, user.last, user.section));
		console.log(databaseBackup);
	}).catch((error) => {
		console.error('Error:', error);
	});
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
		databaseBackup.users = data.map(user => userObject(user.uid, user.role, user.first, user.last, user.section));
		console.log(databaseBackup);
	}).catch((error) => {
		console.error('Error:', error);
	});
}

function getTransactions(){

}

function getExpenses(){

}
