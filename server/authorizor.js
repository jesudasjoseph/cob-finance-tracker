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

//Returns a token for the specified 'user', 'ip' combo.
//Adds user to sessionList
function getToken(uid, ip){
	let role = q.getRole(new q.asker(uid, null));
	let ses = new session(uid, role, ip)
	let token = generateToken(ses);

	addSession(ses);
	return {token: token,
			role: role};
}

//Express middleware
//authenticates jwts sent by clients
function authToken(req, res, next){
	const authHeader = req.headers['authorization'];
	const token = authHeader.split(' ')[1];

	if (token == null)
		return res.sendStatus(401);

	jwt.verify(token, config.secret, function (error, decoded) {
		if (error){
			console.log(error);
			return res.sendStatus(403);
		}
		else{
			req.body.asker = new q.asker(decoded.uid, decoded.role);
		}
	});
	next();
}

//add session to sessionList
function addSession(sessionObj){
	sessionList.push(sessionObj);
}

exports.getToken = getToken;
exports.authToken = authToken;
exports.createSession = addSession;
