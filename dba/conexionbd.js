var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10000,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b1f5be8dcef2b6",
  password: "a5b02483",
  database: "heroku_de86678f01af14e"
});

module.exports = pool;