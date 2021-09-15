const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	HTTPS_PORT: process.env.HTTPS_PORT,
	HTTP_PORT: process.env.HTTP_PORT,

	API_SECRET: process.env.API_SECRET,

	HOSTNAME: process.env.HOSTNAME,

	SAML_ENTRY_POINT: process.env.SAML_ENTRY_POINT,
	SAML_CERT: process.env.SAML_CERT,

	SSL_KEY_PATH: process.env.SSL_KEY_PATH,
	SSL_CERT_PATH: process.env.SSL_CERT_PATH,

	certbotCertificateRenewalURL: process.env.certBotURL,
	certbotCertificateRenewalMSG: process.env.certBotMSG,

	devMode: process.env.DEV_MODE,
	devUsername: process.env.DEV_USERNAME,
	devPassword: process.env.DEV_PASSWORD
};
