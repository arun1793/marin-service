'use strict';

//const user = require('../models/user');
var user = "dhananjay.p";
var getpolicy = "get";
const bcSdk = require('../src/blockchain/blockchain_sdk');

exports.fetch_Policy_list = (params) => {
    return new Promise((resolve, reject) => {
        bcSdk.fetchPolicylist({
            user: user,
            getpolicy: getpolicy
        })

        .then((policyArray) => {
            console.log("data in policyArray " + policyArray)
            return resolve({
                status: 201,
                "policylist": policyArray
            })
        })



        .catch(err => {

            if (err.code == 11000) {

                return reject({
                    status: 409,
                    message: 'cant fetch !'
                });

            } else {
                console.log("error occurred" + err);

                return reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            }
        })
    })
};