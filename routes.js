//here only routing is done

'use strict';

const register = require('./functions/register');
const login = require('./functions/login');
const logout = require('./functions/logout');


module.exports = router => {
    //registerUser- routes user input to function register.
    router.post('/registerUser', (req, res) => {
        // const uid = Math.floor(Math.random() * (100000 - 1)) + 1;
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
            console.log("register object" + register)

            register.registerUser(fname, lname, phone, email, usertype, password)

            .then(result => {

                res.status(result.status).json({ status: result.status, message: result.message })
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
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
    router.get('/fetchPolicyQuotes', (req, res) => {
        res.send({
            Consignment_Detail: [{
                "policyName": "Marine Insurance",
                "Roadways Eligibility": "Available",
                "Ship Eligibility ": "Available",
                "Train Eligibilty": "Available",
                "Air Eligibilty": "Not_Available",
                "policyAmount": "1Lac",
                "sumInsured": "50k",
                "Annually": "6k"
            }, {

                "policyName": "Blue Dart",
                "Roadways Eligibility": "Available",
                "Ship Eligibility ": "Available",
                "Train Eligibilty": "Available",
                "Air Eligibilty": "Not_Available",
                "policyAmount": "2Lac",
                "sumInsured": "1.25ac",
                "Annually": "20k"

            }, {
                "policyName": "DHFL",
                "Roadways Eligibility": "Available",
                "Ship Eligibility ": "Available",
                "Train Eligibilty": "Available",
                "Air Eligibilty": "Not_Available",
                "policyAmount": "1.5Lac",
                "sumInsured": "7.25k",
                "Annually": "15k"
            }, {
                "policyName": "Blue Dart",
                "Roadways Eligibility": "Available",
                "Ship Eligibility ": "Available",
                "Train Eligibilty": "Available",
                "Air Eligibilty": "Not_Available",
                "policyAmount": "2Lac",
                "sumInsured": "1.25ac",
                "Annually": "20k"

            }]
        })

    });
    //cifPolicy- routes user input to function cifPolicy
    router.post('/cifPolicy', (req, res) => {
        const id = req.body.id;
        console.log(`Id from ui side`, id);
        const consignmentweight = req.body.consignmentweight;
        console.log(`consignmentweight from ui side`, consignmentweight);
        const consignmentvalue = req.body.consignmentvalue;
        console.log(`consignmentvalue from ui side`, consignmentvalue);
        const transportmode = req.body.transportmode;
        console.log(`transportmode from ui side`, transportmode);
        if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });
        } else {

            cif.cifPolicy(id, consignmentweight, consignmentvalue, transportmode)

            .then(result => {
                res.status(result.status).json({ message: result.message, transportmode: transportmode });
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }

    });
    //cisPolicy- routes user input to function cisPolicy
    router.post('/cisPolicy', (req, res) => {
        const id = req.body.id;
        console.log(`Id from ui side`, id);
        const consignmentweight = req.body.consignmentweight;
        console.log(`consignmentweight from ui side`, consignmentweight);
        const consignmentvalue = req.body.consignmentvalue;
        console.log(`consignmentvalue from ui side`, consignmentvalue);
        const transportmode = req.body.transportmode;
        console.log(`transportmode from ui side`, transportmode);
        if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });
        } else {

            cif.cisPolicy(id, consignmentweight, consignmentvalue, transportmode)

            .then(result => {
                res.status(result.status).json({ message: result.message, transportmode: transportmode });
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }

    });
    //cipPolicy- routes user input to function cipPolicy
    router.post('/cipPolicy', (req, res) => {
        const id = req.body.id;
        console.log(`Id from ui side`, id);
        const consignmentweight = req.body.consignmentweight;
        console.log(`consignmentweight from ui side`, consignmentweight);
        const consignmentvalue = req.body.consignmentvalue;
        console.log(`consignmentvalue from ui side`, consignmentvalue);
        const transportmode = req.body.transportmode;
        console.log(`transportmode from ui side`, transportmode);
        if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });
        } else {

            cif.cipPolicy(id, consignmentweight, consignmentvalue, transportmode)

            .then(result => {
                res.status(result.status).json({ message: result.message, transportmode: transportmode });
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }

    });
    //fobPolicy- routes user input to function fobPolicy
    router.post('/fobPolicy', (req, res) => {
        const id = req.body.id;
        console.log(`Id from ui side`, id);
        const consignmentweight = req.body.consignmentweight;
        console.log(`consignmentweight from ui side`, consignmentweight);
        const consignmentvalue = req.body.consignmentvalue;
        console.log(`consignmentvalue from ui side`, consignmentvalue);
        const transportmode = req.body.transportmode;
        console.log(`transportmode from ui side`, transportmode);
        if (!id || !consignmentweight || !consignmentvalue || !transportmode || !id.trim() || !consignmentweight.trim() || !consignmentvalue.trim() || !transportmode.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });
        } else {

            cif.fobPolicy(id, consignmentweight, consignmentvalue, transportmode)

            .then(result => {
                res.status(result.status).json({ message: result.message, transportmode: transportmode });
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }

    });
    //issuedpolicy- routes users issued policies 
    router.get('/fetchissuedpolicy', (req, res) => {
        res.send({
            IssuedPolicy_Details: [{
                "policyName": "ICICI Lombard",
                "BookedOn": "21 may 2017",
                "Issued": "12000-INR"
            }, {

                "policyName": "Blue Dart",
                "BookedOn": "2 june 2017",
                "Issued": "14500-INR"
            }, {
                "policyName": "New India Insurence",
                "BookedOn": "21 jan 2017",
                "Issued": "25000-INR"
            }, {
                "policyName": "Oriental",
                "BookedOn": "24 feb 2017",
                "Issued": "25340-INR"
            }]
        })
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