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
const authorizor = require('./authorizor');
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

app.use(cors()); //Use cors middleware
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'build'),)); //Use Static Website Build Path

//ping
app.get('/ping', (req, res) => {
  return res.send('pong')
})

//SAML Strategy config
//This also checks if user exists.
passport.use(new SamlStrategy({
		entryPoint: 'https://login-int.iam.oregonstate.edu/idp/profile/SAML2/Redirect/SSO',
		issuer: 'https://71.193.191.23:2020',
		callbackUrl: 'https://71.193.191.23:2020/saml/consume',
		cert: config.samlCert
	},
	async (profile, done) => {
		let {code, data} = await authorizor.getToken(profile.nameID.split('@')[0]);

		if (code === 200){
			return done(null, data);
		}
		else{
			return done(code);
		}
	}));

app.get('/login',
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
		auth_user = req.user;
		res.redirect('/home');
});
app.get('/home',
	(req, res) => {
		if (auth_user === undefined){
			res.redirect('/login');
		}
		else {
			let redirect = "Dashboard";
			if (auth_user.role === 0){
				redirect = "Dashboard";
			}
			else {
				redirect = "DashboardI";
			}
			const authPage = `<script>let myStorage = window.localStorage; myStorage.setItem('jwt','Bearer ' + '${auth_user.token}'); myStorage.setItem('role', ${auth_user.role}); window.location.href = '/${redirect}';</script>`;
			auth_user = undefined;

			res.type('.html');
			res.send(authPage);
		}
});

console.log(path.resolve(__dirname, 'build', 'index.html'));

app.use(express.json()); //Parse body
//app.use(helmet()); //Use helmet as a middleware to help with http header security

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
