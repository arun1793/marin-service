//here only routing is done

'use strict';

const register = require('./functions/register');
const fetchpolicy = require('./functions/fetchpolicy');
const consignment = require('./functions/consignment');
const fetchPolicylist = require('./functions/fetchpolicylist');
const fetchUserlist = require('./functions/getuser');
const fetchConsignmentlist = require('./functions/getconsignment');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');

// connection to database.
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
    router.post('/user/registerUser', (req, res) => {
        var objBD = BD();
        objBD.connect();
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
            //the if statement checks if any of the above paramenters are null or not..if is then it sends an error report.
            res.status(400).json({ message: 'Invalid Request !' });
        }
        var user = {
            fname: fname,
            lname: lname,
            phone: phone,
            email: email,
            usertype: usertype,
            password: password,
            status: "Inactive"
        };
        objBD.query('INSERT INTO user_detail SET ?', user, function(error) {
            if (error) {

            } else {
                var otp = "";
                var possible = "0123456789";
                for (var i = 0; i < 4; i++)
                    otp += possible.charAt(Math.floor(Math.random() * possible.length));
                var remoteHost = "192.168.0.16:3000";
                console.log(remoteHost);
                var encodedMail = new Buffer(req.body.email).toString('base64');
                var link = "http://" + remoteHost + "/marine/user/verify?mail=" + encodedMail;
                var userResults, emailtosend, phonetosend, otptosend;
                console.log(userResults);
                objBD.query('select * from user_detail WHERE email = ?', [req.body.email], function(error, results, fields) {
                    console.log(userResults)
                    userResults = JSON.parse(JSON.stringify(results));
                    console.log("results: " + userResults[0].email);
                    console.log("results:" + userResults[0].phone);
                    emailtosend = userResults[0].email;
                    phonetosend = userResults[0].phone;
                    objBD.query('INSERT INTO verification( uid, otp,encodedMail) values ( ?, ?, ?)', [userResults[0].uid, otp, encodedMail], function(error, results, fields) {});

                    //after generating otp mail will be sent to regsitered user.
                    var mailOptions = {
                        transport: transporter,
                        from: '"Dhananjay"<dhananjay.patil@rapidqube.com>',
                        to: emailtosend,
                        subject: 'Please confirm your Email account',
                        text: "Below link will expire in 15 minutes",
                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {}
                    });

                    //otp will be sent via sms to validate phone number.
                    otptosend = "OTP: " + otp;
                    nexmo.message.sendSms(
                        '919768135452', phonetosend, otptosend, { type: 'unicode' },
                        (err, responseData) => { if (responseData) { console.log(responseData) } }
                    );
                });
                register.registerUser(uid, fname, lname, phone, email, usertype, password)

                .then((result) => {
                        res.status(200).json({ "message": "true", "status": "Registration successful" });
                    })
                    .catch(err => res.status(err.status).json({ message: err.message }));
            }
        });
    });

    // getuser - query method fetches details stored in ledger. 
    router.get('/user/getuser', (req, res) => {

        if (1 == 1) {
            fetchUserlist.fetch_userlist({
                    "user": "dhananjay.p",
                    "getusers": "getusers"
                })
                .then(function(result) {
                    res.json({
                        message: "user detail fetched",
                        userList: result.usersdata

                    });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {

            res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });

    //verify-validates user emailid
    router.get('/user/verify', cors(), (req, res, next) => {
        var querymail = req.query.mail;
        console.log("URL: " + querymail);
        var objBD = BD();
        objBD.connect();

        objBD.query('SELECT * FROM verification WHERE encodedMail = ?', [querymail], function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                var resultLength = JSON.parse(JSON.stringify(results));
                if (resultLength.length > 0) {
                    if (resultLength[0].encodedMail === querymail) {
                        console.log(querymail);
                        res.send({
                            "status": true,
                            "message": "verification Successfull"
                        });
                    } else {
                        res.send({
                            "status": false,
                            "message": "already verified"
                        });
                    }
                }
            }
        });
    });

    //phoneverification- validates phone number
    router.post('/user/phoneverification', cors(), (req, res) => {
        var objBD = BD();
        objBD.connect();

        var otp = req.body.otp;
        console.log(otp);

        objBD.query('SELECT * FROM verification where otp=?', [otp], function(error, results, fields) {
            if (error) {
                res.send({
                    "status": false,
                    "message": "error"
                })
            } else {
                var otplength = JSON.parse(JSON.stringify(results));
                console.log(results);
                if (otplength.length > 0) {
                    if (otplength[0].otp === otp) {
                        console.log(otp);
                        console.log(otplength[0].uid);
                        objBD.query('UPDATE user_detail Set status ="Active" where uid= ? ', otplength[0].uid, function(error, results, fields) {});

                        res.send({
                            "status": true,
                            "message": "phone number verified"
                        });
                    } else {
                        res.send({
                            "status": false,
                            "message": "phone number is invalid"
                        });
                    }
                }
            }
        });
    });

    //userLogin- on user input this service gets invoked
    router.post('/user/userLogin', cors(), (req, res) => {
        var objBD = BD();
        objBD.connect();
        console.log(req.body);
        var email = req.body.email;
        var password = req.body.password;
        objBD.query('SELECT * FROM user_detail WHERE email = ?', [email], function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                var resultLength = JSON.parse(JSON.stringify(results));
                if (resultLength.length > 0) {
                    if (resultLength[0].password === password) {
                        var token = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789rapidqubepvtltd";
                        for (var i = 0; i < 10; i++)
                            token += possible.charAt(Math.floor(Math.random() * possible.length));
                        console.log(token);

                        objBD.query('INSERT INTO user_session( uid, token) values ( ?, ?)', [resultLength[0].uid, token], function(error, results, fields) {});
                        res.send({
                            "status": true,
                            "token": token,
                            "message": "Login Successfull"
                        });
                    } else {
                        res.send({
                            "status": false,
                            "token": "null",
                            "message": "Email and password does not match"
                        });
                    }
                } else {
                    res.send({
                        "status": false,
                        "token": "null",
                        "message": "Email does not exist"
                    });
                }
            }
        });
    });

    //fetchPolicyQuotes- routes user input to function fetchpolicy
    router.post('/user/fetchPolicyQuotes', (req, res) => {
        var objBD = BD();
        objBD.connect();
        var token = req.get('Authorization');
        const uid = Math.floor(Math.random() * (100000 - 1)) + 1;
        const id = uid.toString();
        const consignmentWeight = req.body.consignmentWeight;
        const consignmentValue = req.body.consignmentValue;
        const contractType = req.body.contractType;
        const policyType = req.body.policyType;

        if (!contractType || !contractType.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            objBD.query('SELECT * FROM user_session WHERE token = ?', token, function(error, results, fields) {

                var id = JSON.parse(JSON.stringify(results));

                var policy = {
                    consignmentWeight: consignmentWeight,
                    consignmentValue: consignmentValue,
                    contractType: contractType,
                    policyType: policyType,
                    uid: id[0].uid
                }
                objBD.query('INSERT INTO savepolicy SET ? ', [policy], function(error) {});

                var policyList;
                var cifPolicy;
                var cisPolicy;
                var cipPolicy;
                var fobPolicy;

                if (policyType == "cifPolicy") {

                    policyList = [{
                            "policyName": "Marine Insurance",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "3,500",
                            "sumInsured": "50,000",
                            "premiumPayment": "12k"
                        }, {
                            "policyName": "Blue Dart",
                            "Roadways": "False",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "True",
                            "premiumAmount": "4,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"

                        }, {
                            "policyName": "DHFL",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "True",
                            "premiumAmount": "3,000",
                            "sumInsured": "1,00,000",
                            "premiumPayment": "15k"
                        }, {
                            "policyName": "Blue Dart",
                            "Roadways": "True",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "False",
                            "premiumAmount": "3,750",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"

                        },
                        {
                            "policyName": "Maersk",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "2,25,000",
                            "premiumPayment": "55k"
                        },
                        {
                            "policyName": "ICICI Lombard",
                            "Roadways": "False",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "True",
                            "premiumAmount": "1,500",
                            "sumInsured": "50,000",
                            "premiumPayment": "6k"
                        }
                    ]

                } else if (policyType == "cisPolicy") {

                    policyList = [{
                            "policyName": "ICICI Insurance",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "3,000",
                            "sumInsured": "1,50,000",
                            "premiumPayment": "60k"
                        },
                        {
                            "policyName": "Maersk",
                            "Roadways": "False",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "True",
                            "premiumAmount": "5,000",
                            "sumInsured": "2,25,000",
                            "premiumPayment": "55k"
                        },
                        {
                            "policyName": "Doodle",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "True",
                            "premiumAmount": "5,000",
                            "sumInsured": "7,25,000",
                            "premiumPayment": "15k"
                        },
                        {
                            "policyName": "MineDart",
                            "Roadways": "True",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"
                        },
                        {
                            "policyName": "Marine Insurance",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "1,000",
                            "sumInsured": "50,000",
                            "premiumPayment": "12k"
                        }, {
                            "policyName": "Blue Dart",
                            "Roadways": "False",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "True",
                            "premiumAmount": "3,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"
                        }
                    ]

                } else if (policyType == "cipPolicy") {
                    policyList = [{
                            "policyName": "All India Insurance",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "1,000",
                            "sumInsured": "50,000",
                            "premiumPayment": "6k"
                        },
                        {
                            "policyName": "wizCraft",
                            "Roadways": "False",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "True",
                            "premiumAmount": "5,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"
                        },
                        {
                            "policyName": "DreamWork",
                            "Roadways": "False",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "True",
                            "premiumAmount": "5,000",
                            "sumInsured": "7,25,000",
                            "premiumPayment": "15k"
                        },
                        {
                            "policyName": "Emirates",
                            "Roadways": "True",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"
                        },
                        {
                            "policyName": "Marine Insurance",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "1,000",
                            "sumInsured": "50,000",
                            "premiumPayment": "12k"
                        },
                        {
                            "policyName": "Blue Dart",
                            "Roadways": "False",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "True",
                            "premiumAmount": "3,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"
                        }
                    ]

                } else if (policyType == "fobPolicy") {

                    policyList = [{
                            "policyName": "ICICI Lombard",
                            "Roadways": "False",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "True",
                            "premiumAmount": "1,000",
                            "sumInsured": "50,000",
                            "premiumPayment": "6k"
                        },
                        {
                            "policyName": "Oriental",
                            "Roadways": "True",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"
                        },
                        {
                            "policyName": "DHFL",
                            "Roadways": "False",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "True",
                            "premiumAmount": "5,000",
                            "sumInsured": "7,25,000",
                            "premiumPayment": "15k"
                        },
                        {
                            "policyName": "Harwlett Packards",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "1,25,000",
                            "premiumPayment": "20k"

                        },
                        {
                            "policyName": "Maersk",
                            "Roadways": "True",
                            "Shipping": "False",
                            "Railway": "True",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "2,25,000",
                            "premiumPayment": "55k"
                        },
                        {
                            "policyName": "Doodle",
                            "Roadways": "True",
                            "Shipping": "True",
                            "Railway": "False",
                            "Airways": "False",
                            "premiumAmount": "5,000",
                            "sumInsured": "7,25,000",
                            "premiumPayment": "15k"
                        }
                    ]

                }

                fetchpolicy.fetchPolicyQuotes(id, consignmentWeight, consignmentValue, contractType, policyType)

                .then((result) => {
                    res.status(200).json({ "policyList": policyList });
                })
            });
        }
    });

    //policylist- query fetches user input given by user for fetching policy.
    router.get('/user/policyList', (req, res) => {

        if (1 == 1) {
            fetchPolicylist.fetch_Policy_list({
                    "user": "dhananjay.p",
                    "get": "get"
                })
                .then(function(result) {
                    res.json({
                        message: "policy detail fetched",
                        policyList: result

                    });
                    //res.json(result)
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {

            res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });

    //Consignment-routes user input to function consignment
    router.post('/user/consignmentDetail', cors(), (req, res) => {
        var objBD = BD();
        objBD.connect();
        var token = req.get('Authorization');
        const uid = Math.floor(Math.random() * (100000 - 1)) + 1;
        const id = uid.toString();
        const policyName = req.body.policyName;
        console.log("policyName:" + policyName);
        const premiumAmount = req.body.premiumAmount;
        console.log("premiumamount:" + premiumAmount);
        const sumInsured = req.body.sumInsured;
        console.log("suminsured:" + sumInsured);
        const consignmentType = req.body.consignmentType;
        console.log("consignmenttype:" + consignmentType);
        const packingMode = req.body.packingMode;
        console.log("packingMode:" + packingMode);
        const consignmentWeight = req.body.consignmentWeight;
        console.log("consignmentWeight" + consignmentWeight);
        const consignmentValue = req.body.consignmentValue;
        console.log("consignmentvalue" + consignmentValue);
        const policyType = req.body.policyType;
        console.log(policyType);
        const contractType = req.body.contractType;
        console.log("contractType" + contractType);
        const transportMode = req.body.transportMode;
        console.log("transportmode:" + transportMode);

        if (!policyName || !premiumAmount || !sumInsured || !consignmentType || !packingMode || !consignmentWeight || !consignmentValue || !policyType || !contractType || !transportMode || !policyType.trim() || !consignmentType.trim() || !packingMode.trim() || !consignmentWeight.trim() || !consignmentValue.trim() || !contractType.trim() || !policyName.trim() || !premiumAmount.trim() || !sumInsured.trim() || !transportMode.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            objBD.query('SELECT * FROM user_session WHERE token = ?', token, function(error, results, fields) {
                var id = JSON.parse(JSON.stringify(results));

                var udetail = {
                    uid: id[0].uid,
                    policyName: policyName,
                    premiumAmount: premiumAmount,
                    sumInsured: sumInsured,
                    consignmentType: consignmentType,
                    packingMode: packingMode,
                    consignmentWeight: consignmentWeight,
                    consignmentValue: consignmentValue,
                    policyType: policyType,
                    contractType: contractType,
                    transportMode: transportMode
                };

                objBD.query('INSERT INTO issuedpolicy SET ?', udetail, function(error) {});

                objBD.query('DELETE from savepolicy where uid = ? ', id[0].uid, function(error) {});


                consignment.consignmentDetail(id, policyName, premiumAmount, sumInsured, consignmentType, packingMode, consignmentWeight, consignmentValue, policyType, contractType, transportMode)

                .then((result) => {
                        res.status(200).json({ "message": "true", "status": "success" });
                    })
                    // .catch(err => res.status(err.status).json({ message: err.message }));
            });
        }
    });

    //getconsignment - query fetches consignment user input given for payment of consignment.
    router.get('/user/getconsignment', (req, res) => {

        if (1 == 1) {
            fetchConsignmentlist.fetch_consignmentlist({
                    "user": "dhananjay.p",
                    "getusers": "getusers"
                })
                .then(function(result) {
                    res.json({
                        message: "user detail fetched",
                        userList: result

                    });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {

            res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });

    //issuedpolicy- fetches users issued policies 
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

    //fetchsavepolicy- fetches saved policies for respective user on token
    router.get('/user/fetchSavePolicy', function(req, res) {
        var objBD = BD();
        objBD.connect();
        var token = req.get('Authorization');
        objBD.query('SELECT * FROM user_session WHERE token = ?', token, function(error, results, fields) {
            var id = JSON.parse(JSON.stringify(results));
            var uid = id[0].uid;
            objBD.query('SELECT * FROM savepolicy WHERE uid = ?', [uid], function(error, results, fields) {
                res.send({
                    "status": true,
                    "results": results
                })
            });
        });
    });

    //userLogout- compares tokens taken from header with database data if it matches deletes token.
    router.get('/user/userLogout', cors(), (req, res) => {
        var objBD = BD();
        objBD.connect();
        var token = req.get('Authorization');
        console.log("Token: " + token);

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
                        console.log(token);
                        objBD.query('delete  from user_session where uid = ?', [resultLength[0].uid, token], function(error, results, fields) {});
                        console.log(token);
                        res.send({
                            "status": true,
                            "message": "Logout Successfull"
                        })
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
}