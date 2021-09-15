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

const VERSION = 1;
const API_URL = '/api/' + VERSION;

let sslKey = fs.readFileSync(config.SSL_KEY_PATH);
let sslCert = fs.readFileSync(config.SSL_CERT_PATH);
let options = {
  key: sslKey,
  cert: sslCert
};

const httpServer = express();

//CERTBOT ssl certificate renewal
httpServer.get(config.certbotCertificateRenewalURL, (req, res) => {
	res.send(config.certBotMSG);
});

httpServer.get('*', (req, res) => {
	res.redirect('https://' + req.hostname + req.url);
});

const app = express();

//Init database connection
q.init();

//Init Dev stuff
if (config.devMode === 'true') {
	q.addDevUser(config.devUsername);
} 
//DeInit Dev Stuff
else {
	q.deleteDevUser(config.devUsername);
}

//Request Routing
let authRouter = require('./routes/auth');
let adminRouter = require('./routes/admin');
let businessRouter = require('./routes/business');
let userRouter = require('./routes/user');
let transactionRouter = require('./routes/transaction');
let expenseRouter = require('./routes/expense');
let depositRouter = require('./routes/deposit');
let exportRouter = require('./routes/export');

//DEV REQUESTS (NOT FOR PRODUCTION)
let devRouter = require('./routes/dev');

app.use(cors()); //Use cors middleware
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'build'),)); //Use Static Website Build Path

//SAML Strategy config
//This also checks if user exists.
passport.use(new SamlStrategy({
		entryPoint: config.SAML_ENTRY_POINT,
		issuer: config.HOSTNAME,
		callbackUrl: config.HOSTNAME + '/saml/consume',
		cert: config.SAML_CERT
	},
	async (profile, done) => {
		let {code, data} = await authorizor.getToken(profile.nameID.split('@')[0]);

		if (data){
			return done(null, data);
		}
		else{
			return done(null, null);
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
		if (req.user){
			auth_user = req.user;
			const authPage = `<script>let myStorage = window.localStorage; myStorage.setItem('jwt','Bearer ' + '${auth_user.token}'); myStorage.setItem('role', ${auth_user.role}); window.location.href = '/login';</script>`;
			res.type('.html');
			res.send(authPage);
		}
		else {
			res.redirect('/unknown-onid');
		}
});

app.use(express.json()); //Parse body
//app.use(helmet()); //Use helmet as a middleware to help with http header security

//API Endpoints
//Router for Authentication requests
app.use(API_URL + '/auth', authRouter);
//Router for Database Admin requests
app.use(API_URL + '/admin', adminRouter);
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

//Dev endpoint
if (config.devMode === 'true'){
	console.log('DEV_MODE is Enabled! ### THIS IS INSECURE ###');
	app.use(API_URL + '/dev', devRouter);
}

//Static Server (Front-End)
app.get(['/', '/*'], (req, res) => {
	res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

let httpsServer = https.createServer(options, app);

//Start HTTP/HTTPS Servers

console.log('Starting server...');
console.log(`Server Config: ${config}`);

httpServer.listen(config.HTTP_PORT, () => {
	console.log(`Listening at http://localhost:${config.HTTP_PORT}`);
});

httpsServer.listen(config.HTTPS_PORT, () => {
	console.log(`Listening at https://localhost:${config.HTTPS_PORT}`);
});

module.exports = app;
