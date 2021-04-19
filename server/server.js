const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyparser = require('body-parser');
const https = require('https');
const config = require('./config');
const path = require('path');
const passport = require('passport');
let SamlStrategy = require('passport-saml').Strategy;
const q = require('./queries');

let key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
let cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
let options = {
  key: key,
  cert: cert
};

const app = express();

const VERSION = 1;
const API_URL = '/api/' + VERSION;

//Init database connection
q.init();

//Request Routing
let authRouter = require('./routes/auth');
let businessRouter = require('./routes/business');
let userRouter = require('./routes/user');
let transactionRouter = require('./routes/transaction');
let expenseRouter = require('./routes/expense');
let depositRouter = require('./routes/deposit');
let exportRouter = require('./routes/export');

//app.use(helmet()); //Use helmet as a middleware to help with http header security
app.use(cors()); //Use cors middleware
app.use(express.json()); //Parse body
app.use(express.static(path.join(__dirname, 'build'),)); //Use Static Website Build Path

passport.use(new SamlStrategy({
		entryPoint: 'https://login-int.iam.oregonstate.edu/idp/profile/SAML2/Redirect/SSO',
		issuer: 'https://71.193.191.23:2020',
		callbackUrl: 'https://71.193.191.23:2020/saml/consume',
		cert: 'MIIEKjCCApKgAwIBAgIVAI6dNgrLT0XnII3Wm2hwwErVz99lMA0GCSqGSIb3DQEBCwUAMCgxJjAkBgNVBAMMHWxvZ2luLWludC5pYW0ub3JlZ29uc3RhdGUuZWR1MB4XDTIwMTIwMzA3MDYwM1oXDTQwMTIwMzA3MDYwM1owKDEmMCQGA1UEAwwdbG9naW4taW50LmlhbS5vcmVnb25zdGF0ZS5lZHUwggGiMA0GCSqGSIb3DQEBAQUAA4IBjwAwggGKAoIBgQCWZj4Q7rgoW8XxaAlU8pIqCC1SNTyk819sw/iIGlByL3xA8qCHjxQ/TNVQgJ4N1EHyUjjwMmIHJMR+xWs1AROPIkuQtYGA+eZpU9urow6kpSnP2fBc4rY2LhD3hTI3PBnDdFooLKWqw8rXTDpcPV/6KvKsyeOt8AlvnNmtVzwUqqbpRROs+VPoYcAbqj2z/Igwr1yrhTvNFsA7mx0zUZyrS16SR0LeOeYkcs7zx2xJe8wLhfxtQfUUsd20tKhJCB5zfexJDVweBn27K12rDqHkaQt0Dzn52h2mVeiy4DcNr4u5XMh2M+W3WTpveRWNJVY1xr5ypB3A9yD4GEBkzQocNXuBvnwhGnOeBZTksMkHPkuj7NG2aCjKLOW6Ai+WbKbUHL0nEqWo+vwUNN/9yM5fPxHcapRUtFcLeOnLasuaGh7e4IYN6embFjHSd8qFHdjofU8vH+U/vsaU+AtETGC3r9I/TeSvphxHRMJJz2/WrqPHQ/u+VlxR8nx/eiwcndMCAwEAAaNLMEkwHQYDVR0OBBYEFECGNvNQAMiH7F++jlyEVkM2rEoiMCgGA1UdEQQhMB+CHWxvZ2luLWludC5pYW0ub3JlZ29uc3RhdGUuZWR1MA0GCSqGSIb3DQEBCwUAA4IBgQBO9/zaYkcRBWMcoJQxm2CIibey9QV6KcuRU7Xgnew+uHhGd/pEjfpq6jpLkbVuT7tToduYhPKDDK8bylF5y2kKuSKs2QWW0ST0qIwbJy4cGiZqfTGhl8j9PlUHeLlbID0Bvhm1rS8YfZWwcIGTol8FtlDidIy9ZdA6+Y86uylpEK3JYQyoPTl0LCgR2J5dM6KBr8F5dUlUM8EaDfcjopkpC3WW5+kpLszlKZrgcnVo31euckLTD9a6EbJpkjP+TpeA6er2quPgITnMQ+3Uo3sxKKWPDsHQuOXr60nxx3d7lRcSk6242b2rZZYxawmrA1POFEHxuZCbIJMEJR/VSG8djt98YLFbh8fg6uiF+Ybl/VGyxx6aTYaW+cKt2ITqUzhsCHdFXa6aWOjCMAY5bKXP15r+xl9F/akg3Qxg2oyGIFMC+h+wbBymHxtV5ThBTrkViNPNtId5K8l/p0g3df0pQZTIfp//9ZJryOKQ3x5MSKmlnGIyTZMKkASmL8a+C9M='
	},
	function(profile, done) {

	}));

//ping
app.get('/ping', (req, res) => {
  return res.send('pong')
})

app.post('/saml/consume',
	bodyparser.urlencoded({extended: false}),
	passport.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
	(req, res) => {
		res.redirect('/');
	});

console.log(path.resolve(__dirname, 'build', 'index.html'));

//API Endpoints
//Router for Authentication requests
app.use(API_URL + '/auth', authRouter);
//Router for Business data requests
app.use(API_URL + '/business', businessRouter);
//Router for User data requests
app.use(API_URL + '/user', userRouter);
//Router for Transaction data requests
app.use(API_URL + '/transaction', transactionRouter);
//Router for Expense data requests
app.use(API_URL + '/expense', expenseRouter);
//Router for Deposit data requests
app.use(API_URL + '/deposit', depositRouter);
//Router for Export data requests
app.use(API_URL + '/export', exportRouter);

//Static Server (Front-End)
app.get(['/', '/*'], (req, res) => {
	res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


let server = https.createServer(options, app);
server.listen(config.port, () => {
	console.log(`Listening at https://localhost:${config.port}`);
});

module.exports = app;
