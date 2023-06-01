const mysql = require("mysql");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "chacharentcar_db",
  port: 3306,
});

module.exports = db;
