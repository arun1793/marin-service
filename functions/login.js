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
exports.userLogin = (email, password) =>

    new Promise((resolve, reject) => {
        const Ui_login = ({

            email: email,
            password: password
        });

        objBD.connect();
        objBD.query('SELECT * FROM user_detail WHERE email = ?', [email], function(error, results, fields) {

            if (error) {

                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                var resultLength = JSON.parse(JSON.stringify(results));

                if (resultLength.length > 0) {

                    if (resultLength[0].password === password) {
                        var token = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789rapidqubepvtltd";

                        for (var i = 0; i < 10; i++)
                            token += possible.charAt(Math.floor(Math.random() * possible.length));

                        var expires = new Date();
                        expires.setHours(expires.getHours() + 6);

                        Ui_login.resetToken = {
                            token: token,
                            expires: expires
                        };

                        objBD.query('INSERT INTO user_session( uid, token) values ( ?, ?)', [resultLength[0].uid, token], function(error, results, fields) {});
                    }
                }
            }
        })

        .then(() => resolve({ "status": true, "message": "Login Successfull", "token": "token" }))

        .catch(err => {
            if (err.code == 409) {
                reject({ status: 409, message: 'User Already Registered !' });

            } else {
                conslole.log("error occurred" + err);
            }
        })
    });