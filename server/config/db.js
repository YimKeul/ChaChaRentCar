var mysql = require("mysql");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "mysql",
  port: 3306,
});

module.exports = db;
