const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db.js");

app.get("/", (req, res) => {
  res.send("Hello world");
  console.log("root");
});

// 날짜 선택만으로 전체 차량 검색
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

// 날짜 선택, 차종 선택 검색
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

// 로그인
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

// 예약 내역
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
      c.name = ? AND rs.startDate > CURDATE()
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
      // console.log(result);
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

//대여 내역
app.get("/rentalList", (req, res) => {
  const userName = req.query.name;

  const query = `
    SELECT
      cm.modelName,
      rc.licensePlateNo,
      rs.startDate,
      rs.endDate,
      (DATEDIFF(CURDATE(), rs.startDate)+1) * cm.rentRatePerDay AS rentRatePerDayAccumulated1,
      (DATEDIFF(rs.endDate, rs.startDate)+1) * cm.rentRatePerDay AS rentRatePerDayAccumulated2
    FROM
      Customer c
    JOIN
      Reserve rs ON c.cno = rs.cno
    JOIN
      RentCar rc ON rs.licensePlateNo = rc.licensePlateNo
    JOIN
      CarModel cm ON rc.modelName = cm.modelName
    WHERE
      c.name = ? AND rs.startDate <= CURDATE()
    ORDER BY
      rs.startDate DESC;
  `;

  db.query(query, [userName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    // console.log(results, userName);
    res.json(results);
  });
});
//이전 대여 내역
app.get("/rentalBeforeList", (req, res) => {
  const userName = req.query.name;

  const query = `
    SELECT
      c.name,
      rc.modelName,
      rc.licensePlateNo,
      pr.dateRented,
      pr.dateReturned,
      pr.payment
    FROM
      Customer c
    JOIN
      PreviousRental pr ON c.cno = pr.cno
    JOIN
      RentCar rc ON pr.licensePlateNo = rc.licensePlateNo
    WHERE
      c.name = ? 
    ORDER BY
      pr.dateRented DESC;
  `;

  db.query(query, [userName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    // console.log("이전목록 ", results);
    res.json(results);
  });
});

//결제(반납)
// app.get("/onPay", (req, res) => {
//   const userName = req.query.name;
//   const paymentValue = req.query.payment;
//   const licensePlateNo = req.query.licensePlateNo;

//   const query = `
//     INSERT INTO PreviousRental (licensePlateNo, dateRented, dateReturned, payment, cno)
//     SELECT rc.licensePlateNo, rs.startDate, rs.endDate, ?, c.cno
//     FROM Customer c
//     JOIN Reserve rs ON c.cno = rs.cno
//     JOIN RentCar rc ON rs.licensePlateNo = rc.licensePlateNo
//     WHERE c.name = ?
//     ${licensePlateNo ? "AND rc.licensePlateNo = ?" : ""};
//   `;

//   const queryParams = [paymentValue, userName];
//   if (licensePlateNo) {
//     queryParams.push(licensePlateNo);
//   }

//   db.query(query, queryParams, (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }

//     res.json(results);
//   });
// });
app.get("/onPay", (req, res) => {
  const userName = req.query.name;
  const paymentValue = req.query.payment;
  const licensePlateNo = req.query.licensePlateNo;

  const query = `
    INSERT INTO PreviousRental (licensePlateNo, dateRented, dateReturned, payment, cno)
    SELECT rc.licensePlateNo, rs.startDate, rs.endDate, ?, c.cno
    FROM Customer c
    JOIN Reserve rs ON c.cno = rs.cno
    JOIN RentCar rc ON rs.licensePlateNo = rc.licensePlateNo
    WHERE c.name = ?
    ${licensePlateNo ? "AND rc.licensePlateNo = ?" : ""}
    ON DUPLICATE KEY UPDATE payment = VALUES(payment);`;

  const queryParams = [paymentValue, userName];
  if (licensePlateNo) {
    queryParams.push(licensePlateNo);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(results);
  });
});

//관리자 질의 1
app.get("/man1", (req, res) => {
  const query = `
    SELECT C.CNO, C.NAME, COUNT(DISTINCT P.LICENSEPLATENO) + COUNT(DISTINCT R.LICENSEPLATENO) AS TotalCount
    FROM Customer C
    LEFT JOIN PreviousRental P ON C.CNO = P.CNO
    LEFT JOIN Reserve R ON C.CNO = R.CNO
    GROUP BY C.CNO, C.NAME
    ORDER BY TotalCount DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(results);
  });
});

//관리자 잘의 2
app.get("/man2", (req, res) => {
  const query = `
    SELECT LICENSEPLATENO, COUNT(*) AS RENTAL_COUNT
    FROM (
      SELECT LICENSEPLATENO
      FROM PreviousRental
      UNION ALL
      SELECT LICENSEPLATENO
      FROM Reserve
    ) AS subquery
    GROUP BY LICENSEPLATENO WITH ROLLUP
    HAVING LICENSEPLATENO IS NOT NULL
    ORDER BY RENTAL_COUNT DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(results);
  });
});

//관리자 질의 3
app.get("/man3", (req, res) => {
  const query = `
    SELECT c.CNO, c.NAME, c.EMAIL,
           r.LICENSEPLATENO, r.STARTDATE, r.RESERVEDATE, r.ENDDATE
    FROM (
      SELECT LICENSEPLATENO, STARTDATE, RESERVEDATE, ENDDATE, CNO,
             ROW_NUMBER() OVER (PARTITION BY LICENSEPLATENO ORDER BY STARTDATE DESC) AS RN
      FROM (
        SELECT LICENSEPLATENO, DATERENTED AS STARTDATE, DATERENTED AS RESERVEDATE, DATERETURNED AS ENDDATE, CNO
        FROM PreviousRental
        UNION ALL
        SELECT LICENSEPLATENO, STARTDATE, RESERVEDATE, ENDDATE, CNO
        FROM Reserve
      ) AS subquery
    ) AS r
    JOIN Customer c ON r.CNO = c.CNO
    WHERE r.RN = 1;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(results);
  });
});

//메일 보내기 작업용
app.get("/getEmail", (req, res) => {
  const userName = req.query.name;

  const query = `
    SELECT email
    FROM Customer
    WHERE name = ?;
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

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});
