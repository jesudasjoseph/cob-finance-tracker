const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	porthttps: process.env.PORTHTTPS,
	porthttp: process.env.PORTHTTP,

	secret: process.env.API_KEY,

	samlCert: process.env.SAML_CERT,
	samlIssuer: process.env.SAML_ISSUER,
	samlCallbackUrl: process.env.SAML_CBURL,

	sslKeyPath: process.env.SSL_KEY_PATH,
	sslCertPath: process.env.SSL_CERT_PATH,

	certbotCertificateRenewalURL: process.env.certBotURL,
	certbotCertificateRenewalMSG: process.env.certBotMSG,

	devMode: process.env.DEV_MODE,
	devUsername: process.env.DEV_USERNAME,
	devPassword: process.env.DEV_PASSWORD
};
