var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';


exports.fetchPolicyQuotes = (id, consignmentWeight, consignmentValue, contractType, policyType) =>
    new Promise((resolve, reject) => {
        const policy = ({

            id: id,
            consignmentWeight: consignmentWeight,
            consignmentValue: consignmentValue,
            contractType: contractType,
            policyType: policyType
        })

        bcSdk.fetchpolicy({ user: user, PolicyDetails: policy })

        .then(() => resolve({ "status": true, "message": "policy fetched" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ status: 409, message: 'already fetched' });

            } else {
                console.log("error occurred" + err);

                reject({ status: 500, message: 'Internal Server Error !' });
            }
        });
    });