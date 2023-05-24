const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db.js");

app.get("/", (req, res) => {
  console.log("/root");
});

app.get("/car", (req, res) => {
  console.log("/car");
  // MySQL에서 사용자 데이터 가져오기
  db.query("SELECT * FROM CarModel", (err, data) => {
    if (!err) {
      console.log(data);
    } else {
      console.log(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});
