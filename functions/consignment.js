var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';


exports.consignmentDetail = (id, policyName, premiumAmount, sumInsured, consignmentType, packingMode, consignmentWeight, consignmentValue, policyType, contractType, transportMode) =>
    new Promise((resolve, reject) => {
        const policy = ({
            id: id,
            policyName: policyName,
            premiumAmount: premiumAmount,
            sumInsured: sumInsured,
            consignmentType: consignmentType,
            packingMode: packingMode,
            consignmentWeight: consignmentWeight,
            consignmentValue: consignmentValue,
            policyType: policyType,
            contractType: contractType,
            transportMode: transportMode
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