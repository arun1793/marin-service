var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';


exports.consignmentDetail = (id, policyType, consignmentType, packingMode, consignmentWeight, consignmentValue, contractType, policyName, premiumAmount, sumInsured) =>
    new Promise((resolve, reject) => {
        const policy = ({
            id: id,
            policyType: policyType,
            consignmentType: consignmentType,
            packingMode: packingMode,
            consignmentWeight: consignmentWeight,
            consignmentValue: consignmentValue,
            contractType: contractType,
            policyName: policyName,
            premiumAmount: premiumAmount,
            sumInsured: sumInsured
        })

        bcSdk.consignmentdetail({ user: user, ConsignmentDetails: policy })

        .then(() => resolve({ "status": true, "message": "policy fetched" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ status: 409, message: 'already fetched' });

            } else {
                conslole.log("error occurred" + err);

                reject({ status: 500, message: 'Internal Server Error !' });
            }
        });
    });