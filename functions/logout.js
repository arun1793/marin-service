'use strict';
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');

var user = "dhananjay_login";


function BD() {
    var connection = mysql.createConnection({
        user: 'root',
        password: 'rpqb123',
        host: 'localhost',
        database: 'marine_db'
    });
    return connection;
}
var objBD = BD();

//exports is used here so that registerUser can be exposed for router and blockchainSdk file as well Mysql.
exports.userLogout = (token) =>

    new Promise((resolve, reject) => {
        const Ui_logout = ({

            token: token
        });

        objBD.connect();

        objBD.query('SELECT * FROM user_session WHERE token = ?', [token], function(error, results, fields) {
            if (error) {

                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {

                var resultLength = JSON.parse(JSON.stringify(results));

                if (resultLength.length > 0) {

                    if (resultLength[0].token === token) {

                        console.log(token);
                        objBD.query('delete  from user_session where uid = ?', [resultLength[0].uid, token], function(error, results, fields) {});
                        console.log(token);

                        res.send({
                            "code": 200,
                            "success": "logout sucessfull"
                        });
                    }
                }
            }
        })

        .then(() => resolve({ status: true, message: 'logout sucessfull', token: token }))

        .catch(err => {

            if (err.code == 409) {

                reject({ status: 409, message: 'User logged out !' });

            } else {
                conslole.log("error occurred" + err);

            }
        })
    });