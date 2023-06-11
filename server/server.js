const express = require("express");
const app = express();
// 포트포워딩
const PORT = process.env.PORT || 4000;
const db = require("./config/db.js");

app.get("/", (req, res) => {
  res.send("Hello world");
  console.log("root");
});
// 로그인
app.post("/onLogin", (req, res) => {
  const inputId = req.query.inputId;
  const inputPw = req.query.inputPw;
  const query = `
    SELECT *
    FROM Customer
    WHERE cno = ? AND passwd = ?;
    `;

  db.query(query, [inputId, inputPw], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 1) {
      // 쿼리 결과가 참인 경우, 로그인성공
      res.json(results[0]);
    } else {
      // 로그인 실패
      res.json(results[0]);
    }
  });
});

//날짜로만 찾는 렌터카

// CarModel과 RentCar 테이블을 modelName을 기준으로 조인하고, RentCar과 Options 테이블을 licensePlateNo를 기준으로 왼쪽 조인한 후, Reserve 테이블에서 startDate와 endDate 사이에 있는 예약된 차량을 제외한 대여 가능한 차량을 반환하는 쿼리

app.get("/searchRentCar", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query = `
      SELECT cm.modelName, rc.licensePlateNo, cm.vehicleType, cm.fuel, cm.numberOfSeats, cm.rentRatePerDay, o.optionName
      FROM CarModel cm
      JOIN RentCar rc ON cm.modelName = rc.modelName
      LEFT JOIN Options o ON rc.licensePlateNo = o.licensePlateNo
      WHERE rc.licensePlateNo NOT IN (
        SELECT r.licensePlateNo
        FROM Reserve r
        WHERE (r.startDate <= ? AND r.endDate >= ?)
      );
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

//날짜&&차종으로 찾는 렌터카
// CarModel과 RentCar 테이블을 modelName을 기준으로 조인하고, RentCar과 Options 테이블을 licensePlateNo를 기준으로 왼쪽 조인한 후, Reserve 테이블에서 startDate와 endDate 사이에 있는 예약된 차량을 제외한 대여 가능한 차량 중에서 주어진 차량 유형과 일치하는 차량만 선택하여 반환하는 쿼리입니다. startDate와 endDate는 대여 가능한 차량을 필터링하기 위해 사용되며, vehicleType은 차량 유형을 지정
app.get("/searchRentCarOps", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const vehicleType = req.query.vehicleType.split(",");

  const query = `
        SELECT cm.modelName, rc.licensePlateNo, cm.vehicleType, cm.fuel, cm.numberOfSeats, cm.rentRatePerDay, o.optionName
        FROM CarModel cm
        JOIN RentCar rc ON cm.modelName = rc.modelName
        LEFT JOIN Options o ON rc.licensePlateNo = o.licensePlateNo
        WHERE rc.licensePlateNo NOT IN (
          SELECT r.licensePlateNo
          FROM Reserve r
          WHERE (r.startDate <= ? AND r.endDate >= ?)
        )
        AND cm.vehicleType IN (?);
      `;

  db.query(query, [endDate, startDate, vehicleType], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

// 예약
// 주어진 이름과 일치하는 고객의 cno (고객 번호)를 Customer 테이블에서 조회한 후, 조회된 cno 값을 사용하여 Reserve 테이블에 새로운 예약 정보를 삽입하는 쿼리입니다. 다른 매개 변수들은 예약 정보에 대한 값으로 대체
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
    }
  );
});

// 예약 후 RentCar 테이블 갱신
// RentCar 테이블과 Reserve 테이블, Customer 테이블, CarModel 테이블을 조인하여 필요한 정보를 검색한 후, 해당 고객 이름과 등록 번호가 일치하는 레코드를 선택합니다. 선택된 정보를 사용하여 RentCar 테이블에 새로운 대여 정보를 삽입하거나 이미 해당 등록 번호가 존재하는 경우에는 대여 정보를 업데이트합니다. 업데이트할 열은 dateRented, dateDue, cno입니다. 이 쿼리는 주어진 고객 이름과 등록 번호에 대한 대여 정보를 RentCar 테이블에 삽입하거나 업데이트
app.get("/updateRentCar", (req, res) => {
  const licensePlateNo = req.query.licensePlateNo;
  const userName = req.query.userName;

  // 사용자 이름과 licensePlateNo에 따른 RentCar 테이블과 Reserve 테이블 업데이트 또는 삽입
  const updateRentCarQuery = `
    INSERT INTO RentCar (LICENSEPLATENO, modelName, dateRented, dateDue, cno)
    SELECT rc.LICENSEPLATENO, cm.modelName, rv.startDate, rv.endDate, rv.CNO
    FROM RentCar AS rc
    JOIN Reserve AS rv ON rc.LICENSEPLATENO = rv.LICENSEPLATENO
    JOIN Customer AS c ON c.cno = rv.CNO
    JOIN CarModel AS cm ON cm.modelName = rc.modelName
    WHERE c.name = ?
      AND rc.LICENSEPLATENO = ?
    ON DUPLICATE KEY UPDATE
      dateRented = VALUES(dateRented),
      dateDue = VALUES(dateDue),
      cno = VALUES(cno);
    `;

  db.query(updateRentCarQuery, [userName, licensePlateNo], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json({
      message: "RentCar and Reserve updated or inserted successfully",
    });
  });
});

// 렌트카 테이블 갱신
// RentCar 테이블을 Reserve 테이블과 왼쪽 조인하여 LICENSEPLATENO가 일치하는 대여 정보를 업데이트합니다. 업데이트할 열은 dateRented, dateDue, cno입니다. 조인 결과가 있는 경우 해당 예약 정보의 시작 날짜, 종료 날짜, 고객 번호를 업데이트하고, 조인 결과가 없는 경우에는 NULL로 설정합니다. 이 쿼리는 주어진 등록 번호에 해당하는 RentCar 테이블의 대여 정보를 예약 정보를 기반으로 업데이트하는 역할을 합니다.
app.get("/updateDeleteRentCar", (req, res) => {
  const licensePlateNo = req.query.licensePlateNo;

  const updateRentCarQuery = `
    UPDATE RentCar AS rc
    LEFT JOIN Reserve AS rv ON rc.LICENSEPLATENO = rv.LICENSEPLATENO
    SET rc.dateRented = IF(rv.LICENSEPLATENO IS NOT NULL, rv.StartDate, NULL),
        rc.dateDue = IF(rv.LICENSEPLATENO IS NOT NULL, rv.EndDate, NULL),
        rc.cno = IF(rv.LICENSEPLATENO IS NOT NULL, rv.cno, NULL)
    WHERE rc.LICENSEPLATENO = ?;
  `;

  db.query(updateRentCarQuery, [licensePlateNo], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json({ message: "RentCar table updated successfully" });
  });
});

// 예약 내역
// 조회된 결과는 특정 고객의 이름과 현재 날짜 이후의 예약 정보에서 대여 가능한 차량의 모델 이름, 등록 번호, 예약 시작 날짜, 예약 종료 날짜를 반환합니다. 결과는 예약 시작 날짜를 기준으로 내림차순으로 정렬
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
      ORDER BY
      rs.startDate DESC;
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

// 예약 취소
// 주어진 이름과 일치하는 고객의 cno를 조회한 후, 해당 cno 값을 사용하여 Reserve 테이블에서 주어진 등록 번호, 예약 시작 날짜, 고객 번호에 해당하는 예약 정보를 삭제하는 역할을 수행
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
// Reserve 테이블과 RentCar 테이블, Customer 테이블을 조인하여 특정 고객이 예약한 현재 날짜 이후의 대여 정보를 조회합니다. 고객 이름과 예약 정보의 고객 번호가 일치하고, 예약 시작 날짜가 현재 날짜 이후인 예약 정보를 선택합니다. 선택된 정보의 모델 이름, 등록 번호, 예약 시작 날짜, 예약 종료 날짜를 반환하며, 결과는 예약 시작 날짜를 기준으로 내림차순으로 정렬
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
// Customer 테이블과 PreviousRental 테이블, RentCar 테이블을 조인하여 특정 고객의 이전 대여 기록을 조회합니다. 고객 이름과 이전 대여 기록의 고객 번호가 일치하는 이전 대여 기록을 선택합니다. 선택된 정보의 고객 이름, 모델 이름, 등록 번호, 대여 날짜, 반납 날짜, 결제 정보를 반환하며, 결과는 대여 날짜를 기준으로 내림차순으로 정렬
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

// 반납
// 고객 이름과 예약 정보, 대여 정보를 기반으로 Customer 테이블, Reserve 테이블, RentCar 테이블을 조인하여 필요한 정보를 검색합니다. 선택된 정보의 등록 번호, 대여 시작 날짜, 현재 날짜, 결제 정보, 고객 번호를 사용하여 PreviousRental 테이블에 대여 이력을 삽입합니다. 그러나 등록 번호가 제공되었고 RentCar 테이블의 licensePlateNo와 일치하는 대여 이력이 이미 존재하는 경우 해당 대여 이력의 결제 정보를 업데이트합니다. 업데이트는 payment 열을 제공된 값으로 설정
app.get("/onPay", (req, res) => {
  const userName = req.query.name;
  const paymentValue = req.query.payment;
  const licensePlateNo = req.query.licensePlateNo;

  const query = `
    INSERT INTO PreviousRental (licensePlateNo, dateRented, dateReturned, payment, cno)
    SELECT rc.licensePlateNo, rs.startDate, CURDATE(), ?, c.cno
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
// Customer 테이블을 왼쪽 조인하여 모든 고객 정보를 선택합니다. PreviousRental 테이블을 고객 번호(CNO)로 왼쪽 조인하고, Reserve 테이블을 고객 번호(CNO)로 왼쪽 조인합니다. 이전 대여 이력의 차량 수와 예약 이력의 차량 수를 고객 번호(CNO), 이름(NAME)과 함께 계산하여 총 차량 수(TotalCount)로 반환합니다. 결과는 총 차량 수(TotalCount)를 기준으로 내림차순으로 정렬
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
// PreviousRental 테이블의 LICENSEPLATENO 열과 Reserve 테이블의 LICENSEPLATENO 열을 결합하여 대여 및 예약 이력의 모든 차량 번호를 선택합니다. 서브쿼리를 사용하여 대여 횟수(RENTAL_COUNT)를 계산하고, 대여 횟수를 기준으로 내림차순으로 정렬하여 조회합니다. WITH ROLLUP 절을 사용하여 대여 횟수의 합계를 포함한 총 대여 횟수를 조회합니다. NULL이 아닌 LICENSEPLATENO 항목만 선택합니다. 결과는 차량 번호(LICENSEPLATENO)와 대여 횟수(RENTAL_COUNT)로 반환되며, 대여 횟수를 기준으로 내림차순으로 정렬됩니다. 총 대여 횟수를 나타내는 항목도 결과에 포함
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
// Reserve 테이블과 PreviousRental 테이블의 대여 시작 날짜와 종료 날짜를 결합하여 대여 기간을 선택합니다. 선택된 대여 기간을 기준으로 대여 횟수(rentalCount)를 계산하고, 대여 시작 날짜, 종료 날짜, 대여 횟수(rentalCount) 및 대여 횟수를 기준으로 내림차순으로 정렬된 순서(row_num)를 포함하여 결과를 선택합니다. 결과는 대여 시작 날짜(startDate), 종료 날짜(endDate), 대여 횟수(rentalCount)로 반환됩니다. 이 쿼리는 대여 시작 날짜와 종료 날짜별 대여 횟수를 대여 및 예약 이력을 기반으로 조회하며, 결과는 대여 시작 날짜, 종료 날짜, 대여 횟수로 반환되며, 대여 횟수에 따라 내림차순으로 정렬됩니다. 각 결과에는 row_num이라는 순서를 나타내는 값이 포함
app.get("/man3", (req, res) => {
  const query = `
  SELECT
    startDate,
    endDate,
    rentalCount
  FROM
    (
        SELECT
            startDate,
            endDate,
            rentalCount,
            ROW_NUMBER() OVER (ORDER BY rentalCount DESC) AS row_num
        FROM
            (
                SELECT
                    r.startDate,
                    r.endDate,
                    COUNT(*) AS rentalCount
                FROM
                    (
                        SELECT
                            r.licensePlateNo,
                            r.startDate,
                            r.endDate
                        FROM
                            chacharentcar_db.Reserve r
                        UNION ALL
                        SELECT
                            pr.licensePlateNo,
                            pr.dateRented AS startDate,
                            pr.dateReturned AS endDate
                        FROM
                            chacharentcar_db.PreviousRental pr
                    ) AS r
                GROUP BY
                    r.startDate,
                    r.endDate
            ) AS subquery
    ) AS ranked;
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

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});
