'use strict';

//const user = require('../blockchai');
var user = "dhananjay_login";
var bcSdk = require('../src/blockchain/blockchain_sdk.js');


exports.userLogin = (email, password) =>

    new Promise((resolve, reject) => {
        const ui_login = ({

            email: email,
            password: password


        });
        console.log("ENTERING THE login MODULE");
        return bcSdk.User_login({ ui_login })

        .then(() => resolve({ status: 200, message: 'User signed in Sucessfully !', token: token }))

        .catch(err => {

            if (err.code == 11000) {

                reject({ status: 409, message: 'User Already Registered !' });

            } else {
                conslole.log("error occurred" + err);

            }
        })
    });