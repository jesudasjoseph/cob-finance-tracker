const fs = require('fs');
const http = require('http');

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
	const { headers, method, url } = request;

	//On error
	request.on('error', (err) => {
  		// This prints the error message and stack trace to `stderr`.
  		console.error(err.stack);
	});

	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');

	let body = [];
	request.on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {

		//Get request body
		body = Buffer.concat(body).toString();
		console.log(body + "lol");

		//Parse body into JSON
		let requestJSON = JSON.parse(body);

		switch (requestJSON.requestType) {
			case "login":
				response.end(accountRegister(requestJSON));
				break;
			default:
				console.log("failed!");
		}



	});
}).listen(configs.port);


function accountRegister(input) {
    //Would verify and query here
	if (input.username == "username" && input.password == "password"){
		userTokens.push(12345);
		console.log("MAde it here!");
		return JSON.stringify({status: "0", token: 12345});
	}
	else {
		return JSON.stringify({status: "1", token: 0});
	}
}
