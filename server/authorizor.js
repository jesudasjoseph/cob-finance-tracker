const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('./config');
const q = require('./queries');

const SESSION_TIMEOUT = 50; //seconds
const MAX_SESSIONS = 100;

let sessionList = [];

function session(uid, role, ip){
	this.sub = generateSID();
	this.sid = this.sub;
	this.uid = uid;
	this.role = role;
	this.ip = ip;
	this.exp = Math.floor(Date.now() / 1000) + SESSION_TIMEOUT;
}

function packet(code, data = null){
	this.code = code;
	this.data = data;
}

//Generate a unique SID
//This function is recurssive
function generateSID(){

	const sid = require('crypto').randomBytes(8).toString('hex');

	function checkDuplicateSid(sid){
		let item;
		for (item in sessionList){
			if (item.sid == sid)
				return false;
		}
		return true;
	}

	if (checkDuplicateSid(sid))
		return sid;
	else{
		console.log('generateSID found duplicate!');
		return generateSID();
	}
}

//Generate a jwt out of a payload provided (expects an object constructed with the function 'session')
function generateToken(payload){
	return jwt.sign({payload}, config.secret);
}

//Returns a token for the specified 'user_id'.
//Adds user to sessionList
//
//returns
//on success - {200, {token, role, user_id}}
//on fail - {http_status}
async function getToken(user_id){
	let {code, data} = await q.getRole(new q.asker(user_id, undefined));
	console.log("Get getRole request in getToken:", data);

	if (data) {
		console.log(data);
		let ses = new session(user_id, data);
		addSession(ses);
		return new packet(200, {token:generateToken(ses), role:data, user_id:user_id});
	}
	else {
		console.log("date == []");
		return new packet(code, null);
	}
}

//Express middleware
//authenticates jwts sent by clients
function authToken(req, res, next){
	const authHeader = req.headers['authorization'];
	let token = 0;
	try {
		token = authHeader.split(' ')[1];
	}
	catch(e) {
		console.log(e);
		return res.sendStatus(401);
	}

	if (token == null)
		return res.sendStatus(401);

	jwt.verify(token, config.secret, function (error, decoded) {
		if (error){
			console.log("jwt-err: " + error);
			return res.sendStatus(400);
		}
		else{
			//Adds the deciphered requestor data to the request body.
			req.body.asker = new q.asker(decoded.payload.uid, decoded.payload.role);
			next();
		}
	});
}

//add session to sessionList
function addSession(sessionObj){
	sessionList.push(sessionObj);
}

exports.getToken = getToken;
exports.authToken = authToken;
exports.createSession = addSession;
