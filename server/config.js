const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	porthttps: process.env.PORTHTTPS,
	porthttp: process.env.PORTHTTP,
	secret: process.env.API_KEY,
	sslKeyPath: process.env.SSL_KEY_PATH,
	sslCertPath: process.env.SSL_CERT_PATH
};
