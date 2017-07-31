//here only routing is done

'use strict';

const register = require('./functions/register');
const nodemailer = require('nodemailer');
// const fetchpolicy = require('./functions/fetchpolicy');
const mysql = require('mysql');
const cors = require('cors');

//connection to database.
function BD() {
    var connection = mysql.createConnection({
        user: 'root',
        password: 'rpqb123',
        host: 'localhost',
        database: 'marine_db'
    });
    return connection;
}
// connection for nexmo free sms service
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: '6a64ffbc',
    apiSecret: '38c40b9428f981e1'
});
// connection to email API 
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.ipage.com',
    port: 587,
    secure: true,
    auth: {
        user: "dhananjay.patil@rapidqube.com",
        pass: "Rpqb@12345"
    }
});

module.exports = router => {
    //registerUser- routes user input to function register.
    router.post('/registerUser', (req, res) => {
        const id = Math.floor(Math.random() * (100000 - 1)) + 1;
        const uid = id.toString();
        const fname = req.body.fname;
        console.log("data in name:" + fname);
        const lname = req.body.lname;
        console.log("data in email:" + lname);
        const phone = req.body.phone;
        console.log("data in phone:" + phone);
        const email = req.body.email;
        console.log("data in email:" + email);
        const usertype = req.body.usertype;
        console.log("data in usertype:" + usertype);
        const password = req.body.password;
        console.log("data in pasword:" + password);

        if (!fname || !lname || !phone || !email || !usertype || !password || !fname.trim() || !lname.trim() || !phone.trim() ||
            !email.trim() || !usertype.trim() || !password.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            var mailOptions = {
                transport: transporter,
                from: '"Dj✔"<dhananjay.patil@rapidqube.com>',
                email: req.body.email, //'vikram.viswanathan@rapidqube.com',
                subject: req.body.subject, //'Please confirm your Email account',
                text: req.body.text, //'Hello',
                html: '<b>Test Messge</b>'
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);

                }
                console.log("Message sent: " + info.messageId);
                res.send({
                    "status": true,
                    "message": "mail sent wait a moment"
                });

            });
            console.log("register object" + register)

            register.registerUser(uid, fname, lname, phone, email, usertype, password)

            .then(result => {

                res.status(result.status).json({ status: result.status, message: result.message })
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });
    // otp- generates sms otp
    router.post('/otp', (req, res) => {
        // Sends SMS
        nexmo.message.sendSms(

            req.body.fromnumber, req.body.toNumber, req.body.message, { type: 'unicode' },
            (err, responseData) => { if (responseData) { console.log(responseData) } }
        );
        res.send({
            "status": true,
            "message": "Message sent wait a moment"
        });
    });
    // sendmail-sends email of verification after registration
    router.get('/sendmail', function(req, res) {

        var encodedMail = new Buffer('dhananjay.patil@rapidqube.com').toString('base64');
        var link = "http://" + req.get('host') + "/verify?mail=" + encodedMail;
        var decodedMail = new Buffer(encodedMail, 'base64').toString('ascii');
        var mailOptions = {
            transport: transporter,
            from: '"Dj✔"<dhananjay.patil@rapidqube.com>',
            to: 'dhananjay.patil@rapidqube.com', //req.body.to, //'vikram.viswanathan@rapidqube.com',
            subject: 'Please confirm your Email account', //req.body.subject, 
            text: req.body.text, //'Hello',
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);

            }
            console.log("Message sent: " + info.messageId);
            res.send({
                "status": true,
                "message": "mail sent wait a moment"
            });

        });
    });
    // router.post('/user/fetchPolicyQuotes', (req, res) => {

    //     const uid = Math.floor(Math.random() * (100000 - 1)) + 1;
    //     const id = uid.toString();
    //     const ContractType = req.body.contractType;
    //     const ConsignmentWeight = req.body.consignmentWeight;
    //     const ConsignmentValue = req.body.consignmentvalue;
    //     const transportMode = req.body.transportMode;

    //     if (!ContractType) {

    //         res.status(400).json({ message: 'Invalid Request !' });

    //     } else {
    //         fetchpolicy.fetchpolicy(id, ContractType, ConsignmentWeight, ConsignmentValue, transportMode)
    //             .then((result) => {
    //                 res.status(200).json({ message: "added successfully" });
    //             })
    //     }


    // });
    //userLogin- routes user input to function login
    router.post('/userLogin', (req, res) => {

        const email = req.body.email;
        console.log(`email from ui side`, email);
        const password = req.body.password;
        console.log(password, 'password from ui side');

        if (!email || !password || !email.trim() || !password.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {

            login.userLogin(email, password)

            .then(result => {
                res.status(result.status).json({ message: result.message, token: token });
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });

    //Consignment-routes user input to payment gateway
    router.post('/user/consignmentDetail', cors(), (req, res) => {
        var objBD = BD();
        objBD.connect();
        var udetail = {
            policyName: req.body.policyName,
            premiumAmount: req.body.premiumAmount,
            sumInsured: req.body.sumInsured,
            consignmentType: req.body.consignmentType,
            packingMode: req.body.packingMode,
            consignmentWeight: req.body.consignmentWeight,
            consignmentValue: req.body.consignmentValue,
            transportMode: req.body.transportMode,
            contractType: req.body.contractType,
        };
        objBD.query('INSERT INTO issuedpolicy SET ?', udetail, function(error) {

        });
        const transportMode = req.body.transportMode;
        console.log(transportMode);
        const consignmentType = req.body.consignmentType;
        const packingMode = req.body.packingMode;
        const consignmentWeight = req.body.consignmentWeight;
        console.log("consignmentWeight" + consignmentWeight);
        const consignmentValue = req.body.consignmentValue;
        console.log("consignmentvalue" + consignmentValue);
        const contractType = req.body.contractType;
        console.log("contractType" + contractType);
        const policyName = req.body.policyName;
        const premiumAmount = req.body.premiumAmount;
        const sumInsured = req.body.sumInsured;
        objBD.query('DELETE from savepolicy where id =?', [ID], function(error) {});
        res.send({
            "message": "true",
            "status": "success"
        })
    });

    //issuedpolicy- routes users issued policies 
    router.get('/user/fetchissuedpolicy', cors(), (req, res) => {
        var objBD = BD();
        objBD.connect();
        var token = req.get('Authorization');
        console.log("Token: " + token);
        var IssuedPolicy_Details;
        objBD.query('SELECT * FROM user_session WHERE token = ?', [token], function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                var resultLength = JSON.parse(JSON.stringify(results));
                if (resultLength.length > 0) {
                    if (resultLength[0].token === token) {
                        IssuedPolicy_Details = [{
                                "policyName": "ICICI Lombard",
                                "issuedDate": "21 may 2017",
                                "issuedAmount": "12000-INR"
                            },
                            {
                                "policyName": "New India Insurence",
                                "issuedDate": "21 jan 2017",
                                "issuedAmount": "25000-INR"
                            }
                        ]
                        res.send({
                            IssuedPolicy_Details
                        });
                    } else {
                        res.send({
                            "status": false,
                            "message": "already ended session"
                        });
                    }
                }
            }

        });
    });
    //userLogout- routes token  to function logout 
    router.post('/userLogout', cors(), (req, res) => {
        const token = req.get('Authorization');
        if (!token || !token.trim()) {
            res.status(400).json({ message: 'Invalid Request!' });
        } else {
            logout.userLogout(token)
                .then(result => {
                    res.status(result.status).json({ message: result.message, token: token });
                })
                .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });
}