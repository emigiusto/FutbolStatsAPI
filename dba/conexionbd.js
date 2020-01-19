var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10000,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "bb561a3d1551f9",
  password: "70334e84",
  database: "heroku_454d23d39588037"
});

module.exports = pool;