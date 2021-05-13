# Business Finance Web Application
A business finance tracker for freshman students in the college of business at Oregon State University

Built with a React-App and a NodeJS API using PostgreSQL as a database management system.

## Deployment

### PosgreSQL


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
