"use strict";

const nodemailer = require("nodemailer");

//Private
let transporter = null;
let emailRecipients;
let senderEmail;

function sendNotificationMail(title, body) {
	if (transporter) {
		transporter.sendMail({
			from: '"Finance Tracker Logger" <'+ senderEmail +'>',
			to: emailRecipients,
			subject: "Error Log",
			text: title + '\n' + body,
			html: `<h2>${title}</h2><p>${body}</p>`
		},
		(err, info) => {
			if (err) {
				console.error("Failed to send notfication via email", err);
			}
		});
	}
}

//Public
function init(smtpHost = null, smtpPort, smtpUser, smtpPassword, email_recipients) {
	if (smtpHost) {
		transporter = nodemailer.createTransport({
			host: smtpHost,
			port: smtpPort,
			secure: true,
			auth: {
				user: smtpUser,
				pass: smtpPassword
			}
		});
		emailRecipients = email_recipients;
		senderEmail = smtpUser;
	}
	else {
		transporter = null
	}
}

function log(logMessage, logType = null){
	if (logType ? logType.includes('error') : false) {
		console.error(logType + ':', logMessage);
		sendNotificationMail(logType, logMessage);
	}
	else {
		console.log((logType ? (logType + ': ') : '') + logMessage);
	}
}

function test() {
	sendNotificationMail('Title', 'hello this is the body!');
}

exports.init = init;
exports.log = log;
exports.test = test;