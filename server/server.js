const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyparser = require('body-parser');
const config = require('./config');
const path = require('path');
const q = require('./queries');

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

//ping
app.get('/ping', (req, res) => {
  return res.send('pong')
})

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

app.listen(config.port, () => {
	console.log(`Listening at http://localhost:${config.port}`);
});

module.exports = app;
