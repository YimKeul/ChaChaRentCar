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

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});
