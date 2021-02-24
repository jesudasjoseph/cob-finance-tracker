Updated: Jan 16, 2021


API Endpoints:
	1. Authentication
	2. User
	3. Business
	4. Expense
	5. Deposit
	6. Transaction



1. Authentication

	Get a token with a GET http request:
		GET host_name/auth?uid=user_id

	Returns
		{
			token:jwt_token,
			role:user_role
		}

2. Business




How to Authenticate:
get token:
	GET SERVER_IP/auth

	This returns a json in the format: {token:JWT_ACCESS_TOKEN}

Authenticate with other requests:
	GET SERVER_IP/resource
	Authorization: Bearer JWT_ACCESS_TOKEN
