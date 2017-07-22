var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
// var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';


exports.cif = (consignmentweight, consignmentvalue, transportmode) =>
    new Promise((resolve, reject) => {
        const policy = ({
            consignmentweight: consignmentweight,
            consignmentvalue: consignmentvalue,
            transportmode: transportmode
        })

        // bcSdk.cifPolicy({ user: user, UserDetails: policy })

        .then(() => resolve({ "status": true, "message": "policy fetched " }))

        .catch(err => {

            if (err.code == 409) {

                reject({ status: 409, message: ' already fetched' });

            } else {
                conslole.log("error occurred" + err);

                reject({ status: 500, message: 'Internal Server Error !' });
            }
        });
    });