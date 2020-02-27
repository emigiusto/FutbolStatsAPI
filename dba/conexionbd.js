var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10000,
  host: "us-cdbr-iron-east-04.cleardb.net",
  user: "b4e2bfbdde73e1",
  password: "827b6c9cfe8b03e",
  database: "heroku_26a00e66485bd8a"
});

module.exports = pool;