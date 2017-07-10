var mysql = require('mysql');
var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'rpqb123',
    database: 'marine_db'
});
connection.connect();

connection.query('select * from user_detail', function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    console.error(result);
});
