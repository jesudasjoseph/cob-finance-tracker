"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'jemajo.sys.alert', // generated ethereal user
      pass: '9u*mc8&8wL55N#!h7o97@G8qf6qZiA3s', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Finance Tracker Alert Service" <jemajo.sys.alert@gmail.com>', // sender address
    to: "jessjmj@gmail.com", // list of receivers
    subject: "Tracker Alert", // Subject line
    text: "some message! A user wants to be added to a business...", // plain text body
    html: "<p>some message! A user wants to be added to a business...</p>", // html body
  });
}

main().catch(console.error);