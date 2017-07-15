//here only routing is done

'use strict';

const register = require('./functions/register');
const login = require('./functions/login');
const logout = require('./functions/logout');


module.exports = router => {

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
        const password = req.body.password;
        console.log("data in pasword:" + password);

        if (!fname || !lname || !phone || !email || !password || !fname.trim() || !lname.trim() || !phone.trim() ||
            !email.trim() || !password.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            console.log("register object" + register)

            register.registerUser(fname, lname, phone, email, password)

            .then(result => {

                res.status(result.status).json({ status: result.status, message: result.message })
            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });

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

    router.get('/fetchPolicyQuotes', (req, res) => {
        res.send({
            policyList: [{
                "policyName": "Marine Insurance",
                "policyAmount": "1Lac",
                "sumInsured": "50k",
                "EMI": "6k"
            }, {

                "policyName": "Blue Dart",
                "policyAmount": "2Lac",
                "sumInsured": "1.25ac",
                "EMI": "20k"

            }, {
                "policyName": "DHFL",
                "policyAmount": "1.5Lac",
                "sumInsured": "7.25k",
                "EMI": "15k"
            }, {
                "policyName": "Blue Dart",
                "policyAmount": "2Lac",
                "sumInsured": "1.25ac",
                "EMI": "20k"

            }]
        })

    });
    //takes token from header and matches with current token and deletes it.
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