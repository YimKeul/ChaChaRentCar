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

app.get("/reserve", (req, res) => {
  const { startDate, endDate, vehicleType } = req.query;
  const query = `
    SELECT cm.modelName, cm.vehicleType, cm.rentRatePerDay, cm.fuel, cm.numberOfSeats,
      o.optionName AS optionName, rc.licensePlateNo
    FROM CarModel cm
    LEFT JOIN RentCar rc ON cm.modelName = rc.modelName
    LEFT JOIN Options o ON rc.licensePlateNo = o.licensePlateNo
    WHERE cm.modelName NOT IN (
      SELECT rc.modelName
      FROM RentCar rc
      WHERE (rc.dateRented <= ?) AND (rc.dateDue >= ?)
    )
    AND cm.vehicleType IN (?)
    AND (rc.dateRented IS NULL OR rc.dateDue < ? OR rc.dateRented > ?)
    AND rc.licensePlateNo IS NOT NULL
  `;
  const params = [startDate, endDate, vehicleType, startDate, endDate];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("데이터 조회 오류:", err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
    console.log(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});
