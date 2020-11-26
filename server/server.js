const fs = require('fs');
const http = require('http');
const url = require('url');

let configs = {
	//default configs
};

let userTokens = [];

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
