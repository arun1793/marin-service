'use strict';

//const user = require('../models/user');
var user = "risabh.s";
var helloworld = "hello_world";
const bcSdk = require('../src/blockchain/blockchain_sdk');

exports.query = (params) => {
    return new Promise((resolve, reject) => {
        bcSdk.read({ user: user, helloworld: helloworld })

        .then((responsebcsdk) => {
            console.log("data in key" + responsebcsdk)
            return resolve({ responsebcsdk })
        })



        .catch(err => {

            if (err.code == 11000) {

                return reject({ status: 409, message: 'cant fetch !' });

            } else {
                conslole.log("error occurred" + err);

                return reject({ status: 500, message: 'Internal Server Error !' });
            }
        })
    })
};