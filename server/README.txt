Updated: Jan 16, 2021

How to Authenticate:
get token:
	GET SERVER_IP/auth

	This returns a json in the format: {token:JWT_ACCESS_TOKEN}

Authenticate with other requests:
	GET SERVER_IP/resource
	Authorization: Bearer JWT_ACCESS_TOKEN
	
