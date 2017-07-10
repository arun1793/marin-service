//here only routing is done and if the ro

'use strict';
/*
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
*/
const query = require('./functions/query');
const login = require('./functions/login');
const register = require('./functions/register');



module.exports = router => {

    router.get('/', (req, res) => res.end('Welcome to marine service,please hit a service !'));


    router.get('/query', (req, res) => {
        if (1 == 1) {

            query.query({ "user": "dhananjay.p", "helloworld": "hello_world" })

            .then(function(result) {
                res.json(result)
            })

            .catch(err => res.status(err.status).json({ message: err.message }));

        } else {

            res.status(401).json({ message: 'cant fetch data !' });
        }
    });


    router.get('/', (req, res) => res.end('Welcome to marine insurance,please hit a service !'));

    router.post('/login', (res, req) => {

        const email = req.body.email;
        console.log(`email from ui side`, email);
        const password = req.body.password;
        console.log(password, 'password from ui');



        if (!email || !password || !email.trim() || !password.trim()) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {

            login.loginUser(email, password)

            .then(result => {

                var token = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789rapidqubepvtltd";

                for (var i = 0; i < 25; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                console.log(token);

                res.status(result.status).json({ message: result.message, token: token, email: email });

            })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });
    router.post('/testmethod', function(req, res) {
        console.log(req.body)
        res.send({ "name": "jay", "email": "rls@gmail.com" });
    });

    router.post('/registerUser', (req, res) => {
        const id = Math.floor(Math.random() * (100000 - 1)) + 1;
        // const id = "212121";
        console.log("data in id:" + id);
        const fname = req.body.fname;
        console.log("data in name:" + fname);
        const lname = req.body.lname;
        console.log("data in email:" + lname);
        const phone = req.body.phone;
        console.log("data in phone:" + phone);
        const email = req.body.email;
        console.log("data in pan:" + email);
        const password = req.body.password;
        console.log("data in aadhar:" + password);
        const repassword = req.body.repassword;
        console.log("data in usertype:" + repassword);



        if (!fname || !lname || !phone || !email || !password || !repassword || !fname.trim() || !lname.trim() || !phone.trim() ||
            !email.trim() || !password.trim() || !repassword.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            console.log("register object" + register)

            register.registerUser(id, fname, lname, phone, email, password, repassword)
                .then(result => {

                    //	res.setHeader('Location', '/registerUser/'+email);
                    res.status(result.status).json({ status: result.status, message: result.message })
                })

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });

}