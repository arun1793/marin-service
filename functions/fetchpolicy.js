'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';


exports.fetchPolicyQuotes = (id, contractType, consignmentWeight, consignmentValue, policyType) =>
    new Promise((resolve, reject) => {
        const policy = ({
            id: id,
            contractType: contractType,
            consignmentWeight: consignmentWeight,
            consignmentValue: consignmentValue,
            policyType: policyType
        });

        bcSdk.FetchPolicy({ user: user, PolicyDetails: policy })

        .then(() => resolve({ "status": true, "message": "policy fetched" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ "status": false, "message": 'already fetched' });

            } else {
                console.log("error occurred" + err);

                reject({ "status": false, "message": 'Internal Server Error !' });
            }
        });
    });