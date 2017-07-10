'use strict';

const bcrypt = require('bcryptjs');
var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';
//exports is used here so that registerUser can be exposed for router and blockchainSdk file
exports.registerUser = (id, fname, lname, phone, email, password, repassword) =>
    new Promise((resolve, reject) => {


        const newUser = ({
            id: id,
            fname: fname,
            lname: lname,
            phone: phone,
            email: email,
            password: password,
            repassword: repassword

        });

        console.log("ENTERING THE Userregisteration from register.js to blockchainSdk");

        bcSdk.UserRegisteration({ user: user, UserDetails: newUser })



        .then(() => resolve({ status: 201, message: usertype }))

        .catch(err => {

            if (err.code == 11000) {

                reject({ status: 409, message: 'User Already Registered !' });

            } else {
                conslole.log("error occurred" + err);

                reject({ status: 500, message: 'Internal Server Error !' });
            }
        });
    });