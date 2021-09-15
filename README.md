# Business Finance Web Application
A business finance tracker for freshman students in the college of business at Oregon State University

Built with a React-App and a NodeJS API using PostgreSQL as a database management system.

## Build/Setup (Tested on Ubuntu20.04.1)

### PosgreSQL
Using a deployment of PostgreSQL, to learn about how to do this visit: [postgresql.org](https://www.postgresql.org/docs/current/tutorial-install.html)

Once your deployment of PostgreSQL server is setup use the `database-schema` to create a database with the correct schema.

### React-App
To deploy the react-app front-end there are 3 steps:
1. Navigate to the cob-finance-app folder
2. run: `npm install` (you might have to run `npm audit fix` to fix any node package vulnerabilities)
3. run: `npm run build`

After these steps the static web-page files will be located in `frontend/build`.

### SSL
Our application runs on HTTPS only. So you'll need a SSL certificate.
The `template.env` file has a line for the path of your .key and .cert files.

### Server
To deploy the server side API and the static web-page files:
1. copy the folder `frontend/build` to the `server/` folder.
2. navigate to the `server` folder.
3. run `npm install`

Setting up port numbers and PostgreSQL server access.
The file: `server/template.env` has all required fields to be filled out for the application to connect to a PostgreSQL server and connect to a SAML-based identity provider. This file must be filled out and renamed to `.env`.
Set DEV_MODE to true and provide a username and password. This will allow you to sign into an account bypassing the SAML authentication. Once deployed go to https://yourdeploymentip/dev and type in your dev password. Add admin accounts as needed and then stop the app and edit the .env so that DEV_MODE = false.

## Deployment
Once all the steps above have been completed then the application is ready to be launched.

Launching the application is as simple as running `node server.js` in the `server` folder.
