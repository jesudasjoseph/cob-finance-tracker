Updated: Jan 16, 2021


API Endpoints:
	1. Authentication
	2. User
	3. Business
	4. Expense
	5. Deposit
	6. Transaction

Random Information:
	replace all items enclosed with {} with your own info.
		example: '{user_id}' -> 'josejesu'




1. Authentication (/auth)

	->GET /auth?uid={user_id}
			This will return a valid token for the user_id.

		Returns
		{
			token:jwt_token,
			role:user_role
		}

All queries below must have the headers:
	'authorization' : 'bearer {jwt_token}'

2. User (/user)
	->GET

3. Business (/business)

	->GET /business?start={start_index}&end={end_index}
			This will return an array of business objects of max length end_index-start_index.

		Returns
		[{
				bid: (Int),
				deposit_count: (Int),
				deposit_total: (String "$5.34"),
				expense_count: (Int),
				expense_total: (String "$6.56"),
				name: (String),
				product_count: (Int),
				profit: (String "$45.65"),
				section: (String ""),
				transaction_count: (Int),
				transaction_total: (String "$34.6")
		},{...},...]

	->POST /business
			This will add business to the business table if used by an Admin/Instructor.
			Body:
			{
				name: {business_name},
				section: {section}
			}

		Returns
		- Nothing

	->DELETE /business/bybid?bid={business_id}
			This will delete a business with a bid of {business_id} only used by Admin/Instructor

		Returns
		- Nothing

3.
