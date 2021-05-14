# Business Finance Web Application
A business finance tracker for freshman students in the college of business at Oregon State University

Built with a React-App and a NodeJS API using PostgreSQL as a database management system.

## Build/Setup (Tested on Ubuntu20.04.1)

### PosgreSQL
Using a deployment of PostgreSQL, to learn about how to do this visit: [postgresql.org](https://www.postgresql.org/docs/current/tutorial-install.html)

Once your deployment of PostgreSQL server is setup use the `database-schema` to create a database with the correct schema.

Make sure to add your ONID to the users table with role='3'. This will allow you admin privellages to the application through your ONID account.

### React-App
To deploy the react-app front-end there are 3 steps:
1. Navigate to the cob-finance-app folder
2. run: `npm install` (you might have to run `npm audit fix` to fix any node package vulnerabilities)
3. run: `npm run build`

After these steps the static web-page files will be located in `cob-finance-app/build`.

### Server
To deploy the server side API and the static web-page files:
1. copy the folder `cob-finance-app/build` to the `server/` folder.
2. navigate to the `server` folder.
3. run `npm install`

Setting up port numbers and PostgreSQL server access.
The file: `server/template.env` has all required fields to be filled out for the application to connect to a PostgreSQL server and connect to OSU's identity provider. This file must be filled out and renamed to `.env`.

### SSL
Our application runs on HTTPS only. So you'll need a SSL certificate.

## Deployment
Once all the steps above have been completed then the application is ready to be launched.

Launching the application is as simple as running `node server.js` in the `server` folder.
