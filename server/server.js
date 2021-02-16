const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyparser = require('body-parser');
const config = require('./config');
const q = require('./queries');

const app = express();


//Init database connection
q.init();

//Request Routing
let authRouter = require('./routes/auth');
let userRouter = require('./routes/user');
let transactionRouter = require('./routes/transaction');
let expenseRouter = require('./routes/expense');
let depositRouter = require('./routes/deposit');

app.use(helmet()); //Use helmet as a middleware to help with http header security
app.use(cors()); //Use cors middleware
app.use(express.json()); //Parse body
//Router for Authentication requests
app.use('/auth', authRouter);
//Router for User data requests
app.use('/user', userRouter);
//Router for Transaction data requests
app.use('/transaction', transactionRouter);
//Router for Expense data requests
app.use('/expense', expenseRouter);
//Router for Deposit data requests
app.use('/deposit', depositRouter);

app.listen(config.port, () => {
	console.log(`Listening at http://localhost:${config.port}`);
})

module.exports = app;
