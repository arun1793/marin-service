//here only routing is done and if the ro

'use strict';
/*
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
*/
const query = require('./functions/query');



module.exports = router => {

    router.get('/', (req, res) => res.end('Welcome to crowdfunding,please hit a service !'));


    router.get('/query', (req, res) => {
        if (1 == 1) {

            query.query({ "user": "risabh.s", "helloworld": "hello_world" })

            .then(function(result) {
                res.json(result)
            })

            .catch(err => res.status(err.status).json({ message: err.message }));

        } else {

            res.status(401).json({ message: 'cant fetch data !' });
        }
    });

}