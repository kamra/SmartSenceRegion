

let nodemailer = require('nodemailer');

let username = process.env.MAIL_USERNAME;
let password = process.env.MAIL_PASSWORD;
let mailService = process.env.MAIL_SERVICE;
let senderEmail = process.env.MAIL_SENDER_ADRESS;

// Will send and email on custom notification
exports.sendMailOnSensorUpdate = function (body, mail) {

   console.log('inside mailhandler!')

    // Only tested with gmail as provider
    let transporter = nodemailer.createTransport({
        service: mailService,
        auth: {
            user: username,
            pass: password
        }
    });


    var mailOptions = {
        from: senderEmail,
        to: mail, // mail
        subject: 'Fiware Sensor: ' + body.data[0].id + " is updated",
        text: JSON.stringify(body)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}