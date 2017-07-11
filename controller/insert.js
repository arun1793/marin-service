var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

function BD() {
    var connection = mysql.createConnection({
        user: 'root',
        password: 'rpqb123',
        host: 'localhost',
        // port: 3306,
        database: 'marine_db'
    });
    return connection;
}

router.post("/user/registerUser", function(req, res) {
    var objBD = BD();
    console.log(req.body.email)
    console.log(req.body.password)

    objBD.connect();
    var user = {
        fname: req.body.fname,
        lname: req.body.lname,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password

    };
    //console.log(user.username)
    objBD.query('INSERT INTO user_detail SET ?', user, function(error) {
        return res.json({
            message: 'success',
            error: false
        });
    });
});
router.post("/user/userLogin", cors(), function(req, res) {
    var objBD = BD();
    objBD.connect()
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    objBD.query('SELECT * FROM user_detail WHERE email = ?', [email], function(error, results, fields) {
        // console.log("results:" + JSON.stringify(results));
        //console.log("fields:" + fields);
        if (error) {
            // console.log("error ocurred",error);

            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('The solution is: ', results);
            var resultLength = JSON.parse(JSON.stringify(results));
            //console.log("Length: " + resultLength.length);
            if (resultLength.length > 0) {
                // console.log("Password: " + resultLength[0].password);
                // console.log("PasswordUI: " + password);
                if (resultLength[0].password === password) {
                    var token = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789rapidqubepvtltd";

                    for (var i = 0; i < 10; i++)
                        token += possible.charAt(Math.floor(Math.random() * possible.length));

                    console.log(token);
                    objBD.query('INSERT INTO user_session( uid, token) values ( ?, ?)', [resultLength[0].uid, token], function(error, results, fields) {});

                    res.send({
                        "code": 200,
                        "success": "login sucessfull",
                        "token": token
                    });
                } else {
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                res.send({
                    "code": 204,
                    "success": "Email does not exits"
                });
            }
        }
    });
});


router.get("/user/get", cors(), function(req, res) {
    var objBD = BD();
    objBD.connect();

    objBD.query('select * from user_detail ', function(error, vals, fields) {
        var temp = JSON.stringify(vals);

        var userdetail = JSON.parse(temp);
        return res.json({
            users: userdetail,
            error: false
        });
    });
});

module.exports = router;