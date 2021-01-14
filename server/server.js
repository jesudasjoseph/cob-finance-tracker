const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyparser = require('body-parser');

let auth = require('./authenticator');

const app = express();


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



let configs = {
	//default configs
};

//Read config file
try {
	const data = fs.readFileSync('config.json', 'utf8');
	console.log("Config file loaded:");
	console.log(data);
	Object.assign(configs, JSON.parse(data));
} catch (err) {
	console.log("Config.json not configured correctly!");
	process.exit(1);
}

app.listen(configs.port, () => {
	console.log(`Listening at http://localhost:${configs.port}`);
})

/*
const server = http.createServer((request, response) => {

	//On error
	request.on('error', (err) => {
  		// This prints the error message and stack trace to `stderr`.
  		console.error(err.stack);
	});

	let requestJSON = url.parse(request.url, true).query;
	if (request.url.startsWith("/q?")) {

		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		response.setHeader('Access-Control-Allow-Origin', '*');

		switch (requestJSON.q) {
			case "login":
				response.write(accountRegister(requestJSON, request.headers.origin));
				response.end();
				console.log("User Tokens:");
				for (let i = 0; i < userTokens.length; i++){
					console.log(userTokens[i]);
				}
				break;
			default:
				response.write("Query not recognized!\n");
				response.end();
				console.log("q not recognized! - q = " + requestJSON.q);
		}

	}
}).listen(configs.port);


function accountRegister(input, host) {
    //Would verify and query here
	if (input.username == "username" && input.password == "password"){
		userTokens.push({id:12345, ip:host});
		console.log("sending.. stuff");
		console.log(JSON.stringify({status: "0", token: 12345}));
		return JSON.stringify({status: "0", token: 12345});
	}
	else {
		return JSON.stringify({status: "1", token: 0});
	}
}
*/

module.exports = app;
