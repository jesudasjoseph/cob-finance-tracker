const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyparser = require('body-parser');
const https = require('https');
const http = require('http');
const config = require('./config');
const path = require('path');
const passport = require('passport');
let SamlStrategy = require('passport-saml').Strategy;
const authorizor = require('./authorizor');
const q = require('./queries');

let key = fs.readFileSync(__dirname + config.sslKeyPath);
let cert = fs.readFileSync(__dirname + config.sslCertPath);
let options = {
  key: key,
  cert: cert
};

const httpServer = express();
httpServer.get('.well-known/acme-challenge/QBanByA1bEalLsHYFWkxS4qXkEFC4X-GM0PuKm-py84', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'cert-config.txt'));
});
httpServer.get('*', (req, res) => {
	res.redirect('https://' + req.hostname + req.url);
});

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

app.use(cors()); //Use cors middleware
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'build'),)); //Use Static Website Build Path


//SAML Strategy config
//This also checks if user exists.
passport.use(new SamlStrategy({
		entryPoint: 'https://login-int.iam.oregonstate.edu/idp/profile/SAML2/Redirect/SSO',
		issuer: config.samlIssuer,
		callbackUrl: config.samlCallbackUrl,
		cert: config.samlCert
	},
	async (profile, done) => {
		let {code, data} = await authorizor.getToken(profile.nameID.split('@')[0]);

		if (code === 200){
			return done(null, data);
		}
		else{
			return done(null, code);
		}
	}));

app.get('/saml/auth',
	passport.authenticate('saml', { failureRedirect: '/saml/fail', failureFlash: true, session: false }),
	function(req, res) {
		res.redirect('/');
	}
);

let auth_user = undefined;

app.post('/saml/consume',
	bodyparser.urlencoded({ extended: false }),
	passport.authenticate('saml', { failureRedirect: '/', failureFlash: true, session: false }),
	(req, res) => {
		if (parseInt(req.user) == 404){
			res.redirect('/unknown-onid')
		}
		else {
			auth_user = req.user;
			const authPage = `<script>let myStorage = window.localStorage; myStorage.setItem('jwt','Bearer ' + '${auth_user.token}'); myStorage.setItem('role', ${auth_user.role}); window.location.href = '/login';</script>`;
			res.type('.html');
			res.send(authPage);
		}
});

console.log(path.resolve(__dirname, 'build', 'index.html'));

app.use(express.json()); //Parse body
//app.use(helmet()); //Use helmet as a middleware to help with http header security

//API Endpoints
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

let serverhttps = https.createServer(options, app);

httpServer.listen(config.porthttp, () => {
	console.log(`Listening at http://localhost:${config.porthttp}`);
});

serverhttps.listen(config.porthttps, () => {
	console.log(`Listening at https://localhost:${config.porthttps}`);
});

module.exports = app;
