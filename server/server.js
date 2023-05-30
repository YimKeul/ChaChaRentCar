const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db.js");

app.get("/", (req, res) => {
  res.send("Hello world");
  console.log("root");
});

app.get("/allcar", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query = `
    SELECT rc.LICENSEPLATENO, cm.modelName, cm.vehicleType, cm.rentRatePerDay, cm.fuel, cm.numberOfSeats, GROUP_CONCAT(op.optionName SEPARATOR ', ') AS options
    FROM CarModel cm
    LEFT JOIN RentCar rc ON cm.modelName = rc.modelName
    LEFT JOIN Options op ON rc.licensePlateNo = op.licensePlateNo
    WHERE rc.licensePlateNo IS NULL OR (rc.licensePlateNo NOT IN (
        SELECT r.LICENSEPLATENO
        FROM Reserve r
        WHERE r.startDate <= ? AND r.endDate >= ?
      )
    )
    GROUP BY rc.LICENSEPLATENO;
  `;

  db.query(query, [endDate, startDate], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(results);
  });
});

app.get("/selecttype", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const vehicleType = req.query.vehicleType.split(",");

  const query = `
  SELECT rc.LICENSEPLATENO, cm.modelName, cm.vehicleType, cm.rentRatePerDay, cm.fuel, cm.numberOfSeats, GROUP_CONCAT(op.optionName SEPARATOR ', ') AS options
  FROM CarModel cm
  LEFT JOIN RentCar rc ON cm.modelName = rc.modelName
  LEFT JOIN Options op ON rc.licensePlateNo = op.licensePlateNo
  WHERE rc.licensePlateNo IS NULL OR (rc.licensePlateNo NOT IN (
      SELECT r.LICENSEPLATENO
      FROM Reserve r
      WHERE r.startDate <= ? AND r.endDate >= ?
  )
)
AND cm.vehicleType IN (?) 
GROUP BY rc.LICENSEPLATENO, cm.modelName, cm.vehicleType, cm.rentRatePerDay, cm.fuel, cm.numberOfSeats;

  `;

  db.query(query, [endDate, startDate, vehicleType], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    } else {
      res.json(results);
    }
  });
});

app.post("/onLogin", (req, res) => {
  const inputId = req.query.inputId;
  const inputPw = req.query.inputPw;
  const query = `
  SELECT *
  FROM Customer
  WHERE email = ? AND passwd = ?;
  `;

  db.query(query, [inputId, inputPw], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length === 1) {
      // 쿼리 결과가 참인 경우
      // res.json({ success: "Login successful" });
      res.json(results[0]);
      // console.log(inputId, inputPw);
      // console.log("로그인 성공");
    } else {
      // 쿼리 결과가 거짓인 경우
      res.json(results[0]);
      // console.log(inputId, inputPw);
      // console.log("로그인 실패");
    }
  });
});

app.get("/reserveList", (req, res) => {
  const userName = req.query.name;

  const query = `
    SELECT
      rc.modelName,
      rc.licensePlateNo,
      rs.startDate,
      rs.endDate
    FROM
      Reserve rs
    JOIN
      RentCar rc ON rs.licensePlateNo = rc.licensePlateNo
    JOIN
      Customer c ON rs.cno = c.cno
    WHERE
      c.name = ? AND rs.startDate >= CURDATE();
  `;

  db.query(query, [userName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(results);
  });
});

// 예약
app.get("/reserve", (req, res) => {
  const licensePlateNo = req.query.licensePlateNo;
  const startDate = req.query.startDate;
  const reserveDate = req.query.reserveDate;
  const endDate = req.query.endDate;
  const customerName = req.query.name;

  const query = `
    INSERT INTO Reserve (licensePlateNo, startDate, reserveDate, endDate, cno)
    VALUES (
      ?,
      ?,
      ?,
      ?,
      (SELECT cno FROM Customer WHERE name = ?)
    );
  `;

  db.query(
    query,
    [licensePlateNo, startDate, reserveDate, endDate, customerName],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      res.json({ message: "Reservation created successfully" });
      console.log(result);
    }
  );
});

// 예약 취소
app.get("/cancelReserve", (req, res) => {
  const licensePlateNo = req.query.licensePlateNo;
  const startDate = req.query.startDate;
  const customerName = req.query.name;

  const query = `
    DELETE FROM Reserve
    WHERE licensePlateNo = ? 
    AND startDate = ?
    AND cno = (
      SELECT cno
      FROM Customer
      WHERE name = ?
    );
  `;

  db.query(query, [licensePlateNo, startDate, customerName], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "No matching reservation found" });
    } else {
      res.json({ message: "Reservation canceled successfully" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});
