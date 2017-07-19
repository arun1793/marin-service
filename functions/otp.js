'use strict';

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const config = require('../config/config.json');

exports.resetPasswordInit = email =>

    new Promise((resolve, reject) => {

        const random = randomstring.generate(8);

        user.find({ email: email })

        .then(users => {

            if (users.length == 0) {

                reject({ status: 404, message: 'email is not valid !' });

            } else {

                let user = users[0];

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(random, salt);

                user.temp_password = hash;
                user.temp_password_time = new Date();

                return user.save();
            }
        })

        .then(user => {

            const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.gmail.com`);

            const mailOptions = {

                from: `"${config.name}" <${config.email}>`,
                to: email,
                subject: 'Reset Password Request ',
                html: `Hello ${user.name},<br><br>
                Your reset password token is <b>${random}</b>.
                If you are viewing this mail from a Android Device click this <a href = "http://learn2crack/${random}">link</a>.
                The token is valid for only 2 minutes.<br><br>
                Thanks,<br>`

            };

            return transporter.sendMail(mailOptions);

        })

        .then(info => {

            console.log(info);
            resolve({ status: 200, message: 'Check mail for instructions' })
        })

        .catch(err => {

            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' });

        });
    });