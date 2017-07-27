//here only routing is done

'use strict';

const register = require('./functions/register');
const login = require('./functions/login');
const logout = require('./functions/logout');
const nodemailer = require('nodemailer');
const cif = require('./functions/cif');
var mysql = require('mysql');
var cors = require('cors');
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

            register.registerUser(fname, lname, phone, email, usertype, password)

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
    //fetchPolicyQuotes- routes policy quotes to function fetchpolicy
    // router.post("/user/fetchPolicyQuotes", cors(), (req, res) => {
    //     const consignmentWeight = req.body.consignmentWeight;
    //     console.log("consignmentWeight" + consignmentWeight);
    //     const consignmentValue = req.body.consignmentValue;
    //     console.log("consignmentvalue" + consignmentValue);
    //     const transportMode = req.body.transportMode;
    //     console.log("transportMode" + transportMode);
    //     const contractType = req.body.contractType;
    //     console.log("contractType" + contractType);

    //     var policyList;
    //     var cifPolicy;
    //     var cisPolicy;
    //     var cipPolicy;
    //     var fobPolicy;
    //     if (contractType == "cifPolicy") {

    //         policyList = [{
    //                 "policyName": "Marine Insurance",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "False",
    //                 "premiumAmount": "1Lac",
    //                 "sumInsured": "50k",
    //                 "premiumPayment": "12k"
    //             }, {
    //                 "policyName": "Blue Dart",
    //                 "Roadways": "False",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "True",
    //                 "premiumAmount": "3Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             }, {
    //                 "policyName": "DHFL",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "True",
    //                 "premiumAmount": "3Lac",
    //                 "sumInsured": "7.25k",
    //                 "premiumPayment": "15k"
    //             }, {
    //                 "policyName": "Blue Dart",
    //                 "Roadways": "True",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "False",
    //                 "premiumAmount": "3Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             },
    //             {
    //                 "policyName": "Maersk",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "False",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "2.25ac",
    //                 "premiumPayment": "55k"

    //             },
    //             {
    //                 "policyName": "ICICI Lombard",
    //                 "Roadways": "False",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "True",
    //                 "premiumAmount": "1Lac",
    //                 "sumInsured": "50k",
    //                 "premiumPayment": "6k"
    //             }
    //         ]

    //     } else if (contractType == "cisPolicy") {

    //         policyList = [{
    //                 "policyName": "ICICI Insurance",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "False",
    //                 "premiumAmount": "3Lac",
    //                 "sumInsured": "1.5Lac",
    //                 "premiumPayment": "60k"
    //             }, {
    //                 "policyName": "Maersk",
    //                 "Roadways": "False",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "True",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "2.25ac",
    //                 "premiumPayment": "55k"

    //             }, {
    //                 "policyName": "Doodle",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "True",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "7.25k",
    //                 "premiumPayment": "15k"
    //             }, {
    //                 "policyName": "MineDart",
    //                 "Roadways": "True",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "False",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             },
    //             {
    //                 "policyName": "Marine Insurance",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "False",
    //                 "premiumAmount": "1Lac",
    //                 "sumInsured": "50k",
    //                 "premiumPayment": "12k"
    //             }, {
    //                 "policyName": "Blue Dart",
    //                 "Roadways": "False",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "True",
    //                 "premiumAmount": "3Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             }
    //         ]

    //     } else if (contractType == "cipPolicy") {
    //         policyList = [{
    //                 "policyName": "All India Insurance",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "False",
    //                 "premiumAmount": "1Lac",
    //                 "sumInsured": "50k",
    //                 "premiumPayment": "6k"
    //             }, {
    //                 "policyName": "wizCraft",
    //                 "Roadways": "False",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "True",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             }, {
    //                 "policyName": "DreamWork",
    //                 "Roadways": "False",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "True",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "7.25k",
    //                 "premiumPayment": "15k"
    //             }, {
    //                 "policyName": "Emirates",
    //                 "Roadways": "True",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "False",
    //                 "premiumAmount": "5Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             },
    //             {
    //                 "policyName": "Marine Insurance",
    //                 "Roadways": "True",
    //                 "Shipping": "False",
    //                 "Railway": "True",
    //                 "Airways": "False",
    //                 "premiumAmount": "1Lac",
    //                 "sumInsured": "50k",
    //                 "premiumPayment": "12k"
    //             }, {
    //                 "policyName": "Blue Dart",
    //                 "Roadways": "False",
    //                 "Shipping": "True",
    //                 "Railway": "False",
    //                 "Airways": "True",
    //                 "premiumAmount": "3Lac",
    //                 "sumInsured": "1.25ac",
    //                 "premiumPayment": "20k"

    //             }
    //         ]

    //     } else if (contractType == "fobPolicy") {

    //         policyList = [{
    //             "policyName": "ICICI Lombard",
    //             "Roadways": "False",
    //             "Shipping": "False",
    //             "Railway": "True",
    //             "Airways": "True",
    //             "premiumAmount": "1Lac",
    //             "sumInsured": "50k",
    //             "premiumPayment": "6k"
    //         }, {
    //             "policyName": "Oriental",
    //             "Roadways": "True",
    //             "Shipping": "True",
    //             "Railway": "False",
    //             "Airways": "False",
    //             "premiumAmount": "5Lac",
    //             "sumInsured": "1.25ac",
    //             "premiumPayment": "20k"

    //         }, {
    //             "policyName": "DHFL",
    //             "Roadways": "False",
    //             "Shipping": "True",
    //             "Railway": "False",
    //             "Airways": "True",
    //             "premiumAmount": "5Lac",
    //             "sumInsured": "7.25k",
    //             "premiumPayment": "15k"
    //         }, {
    //             "policyName": "Harwlett Packards",
    //             "Roadways": "True",
    //             "Shipping": "False",
    //             "Railway": "True",
    //             "Airways": "False",
    //             "premiumAmount": "5Lac",
    //             "sumInsured": "1.25ac",
    //             "premiumPayment": "20k"

    //         }, {
    //             "policyName": "Maersk",
    //             "Roadways": "True",
    //             "Shipping": "False",
    //             "Railway": "True",
    //             "Airways": "False",
    //             "premiumAmount": "5Lac",
    //             "sumInsured": "2.25ac",
    //             "premiumPayment": "55k"

    //         }, {
    //             "policyName": "Doodle",
    //             "Roadways": "True",
    //             "Shipping": "True",
    //             "Railway": "False",
    //             "Airways": "False",
    //             "premiumAmount": "5Lac",
    //             "sumInsured": "7.25k",
    //             "premiumPayment": "15k"
    //         }]

    //     }
    //     res.send({
    //         // "policyList": policyList,
    //         "message": "hello",
    //         "token": "null",
    //         "status": true
    //     });
    // });
    //Consignment-routes user input to payment gateway

    router.post('/user/consignmentDetail', cors(), (req, res) => {
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

        res.send({
            "message": "true",
            "status": "success"
        })
    });

    // //cifPolicy- routes user input to function cifPolicy
    // router.post('/cifPolicy', (req, res) => {
    //     const id = req.body.id;
    //     console.log(`Id from ui side`, id);
    //     const consignmentweight = req.body.consignmentweight;
    //     console.log(`consignmentweight from ui side`, consignmentweight);
    //     const consignmentvalue = req.body.consignmentvalue;
    //     console.log(`consignmentvalue from ui side`, consignmentvalue);
    //     const transportmode = req.body.transportmode;
    //     console.log(`transportmode from ui side`, transportmode);
    //     if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

    //         res.status(400).json({ message: 'Invalid Request !' });
    //     } else {

    //         cif.cifPolicy(id, consignmentweight, consignmentvalue, transportmode)

    //         .then(result => {
    //             res.status(result.status).json({ message: result.message, transportmode: transportmode });
    //         })

    //         .catch(err => res.status(err.status).json({ message: err.message }));
    //     }
    // });
    // // getcifPolicy- fetches stored 

    // //cisPolicy- routes user input to function cisPolicy
    // router.post('/cisPolicy', (req, res) => {
    //     const id = req.body.id;
    //     console.log(`Id from ui side`, id);
    //     const consignmentweight = req.body.consignmentweight;
    //     console.log(`consignmentweight from ui side`, consignmentweight);
    //     const consignmentvalue = req.body.consignmentvalue;
    //     console.log(`consignmentvalue from ui side`, consignmentvalue);
    //     const transportmode = req.body.transportmode;
    //     console.log(`transportmode from ui side`, transportmode);
    //     if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

    //         res.status(400).json({ message: 'Invalid Request !' });
    //     } else {

    //         cif.cisPolicy(id, consignmentweight, consignmentvalue, transportmode)

    //         .then(result => {
    //             res.status(result.status).json({ message: result.message, transportmode: transportmode });
    //         })

    //         .catch(err => res.status(err.status).json({ message: err.message }));
    //     }
    // });
    // //cipPolicy- routes user input to function cipPolicy
    // router.post('/cipPolicy', (req, res) => {
    //     const id = req.body.id;
    //     console.log(`Id from ui side`, id);
    //     const consignmentweight = req.body.consignmentweight;
    //     console.log(`consignmentweight from ui side`, consignmentweight);
    //     const consignmentvalue = req.body.consignmentvalue;
    //     console.log(`consignmentvalue from ui side`, consignmentvalue);
    //     const transportmode = req.body.transportmode;
    //     console.log(`transportmode from ui side`, transportmode);
    //     if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

    //         res.status(400).json({ message: 'Invalid Request !' });
    //     } else {

    //         cif.cipPolicy(id, consignmentweight, consignmentvalue, transportmode)

    //         .then(result => {
    //             res.status(result.status).json({ message: result.message, transportmode: transportmode });
    //         })

    //         .catch(err => res.status(err.status).json({ message: err.message }));
    //     }
    // });
    // //fobPolicy- routes user input to function fobPolicy
    // router.post('/fobPolicy', (req, res) => {
    //     const id = req.body.id;
    //     console.log(`Id from ui side`, id);
    //     const consignmentweight = req.body.consignmentweight;
    //     console.log(`consignmentweight from ui side`, consignmentweight);
    //     const consignmentvalue = req.body.consignmentvalue;
    //     console.log(`consignmentvalue from ui side`, consignmentvalue);
    //     const transportmode = req.body.transportmode;
    //     console.log(`transportmode from ui side`, transportmode);
    //     if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

    //         res.status(400).json({ message: 'Invalid Request !' });
    //     } else {

    //         cif.fobPolicy(id, consignmentweight, consignmentvalue, transportmode)

    //         .then(result => {
    //             res.status(result.status).json({ message: result.message, transportmode: transportmode });
    //         })

    //         .catch(err => res.status(err.status).json({ message: err.message }));
    //     }
    // });
    //issuedpolicy- routes users issued policies 
    router.get('/user/fetchissuedpolicy', (req, res) => {
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
                            }, {

                                "policyName": "Blue Dart",
                                "issuedDate": "2 june 2017",
                                "issuedAmount": "14500-INR"
                            }, {
                                "policyName": "New India Insurence",
                                "issuedDate": "21 jan 2017",
                                "issuedAmount": "25000-INR"
                            }, {
                                "policyName": "Oriental",
                                "issuedDate": "24 feb 2017",
                                "issuedAmount": "25340-INR"
                            },
                            {
                                "policyName": "MAERSK",
                                "issuedDate": "15 july 2017",
                                "issuedAmount": "35000-INR"
                            },
                            {
                                "policyName": "Emirates",
                                "issuedDate": "2 june 2017",
                                "issuedAmount": "39125.50-INR"
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
    router.post('/userLogout', (req, res) => {
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