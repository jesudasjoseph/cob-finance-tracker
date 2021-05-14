const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	porthttps: process.env.PORTHTTPS,
	porthttp: process.env.PORTHTTP,
	secret: process.env.API_KEY,
	samlCert: process.env.SAML_CERT,
	samlIssuer: process.env.SAML_ISSUER,
	samlCallbackUrl: process.env.SAML_CBURL
};
