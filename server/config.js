const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	port: process.env.PORT,
	secret: process.env.API_KEY
};
