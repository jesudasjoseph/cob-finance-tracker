"use strict";

const nodemailer = require("nodemailer");

//Private
let transporter = null;
let emailRecipients;
let senderEmail;

function sendNotificationMail(title, body) {
  if (transporter) {
    transporter.sendMail({
      from: '"Finance Tracker Alert Service" <'+ senderEmail +'>',
      to: emailRecipients,
      subject: "Tracker Alert",
      text: title + '\n' + body,
      html: `<h1>${title}</h1><p>${body}</p>`
    },
    (err, info) => {
      if (err) {
        console.log("Failed to send notfication via email");
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

function test() {
  sendNotificationMail('Title', 'hello this is the body!');
}

exports.init = init;
exports.test = test;