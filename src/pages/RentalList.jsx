import React, { useState, useEffect } from "react";
import {
  Header,
  Cfonts,
  LightGray,
  CnuBlue,
  BgGray,
  convertDateFormat,
} from "../components";
import styled from "styled-components";
import axios from "axios";
import emailjs from "@emailjs/browser";

const RentalList = () => {
  const [nowRent, isNowRent] = useState(true);
  const [isUser, setUser] = useState();
  const [data, setData] = useState();
  const [beforeData, setBeforeData] = useState();
  const [email, getEmail] = useState();

  const handleList = () => {
    isNowRent(!nowRent);
  };

  useEffect(() => {
    setUser(sessionStorage.getItem("userId"));
    axios
      .get(`/rentalList?name=${isUser}`)
      .then((response) => {
        setData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`/rentalBeforeList?name=${isUser}`)
      .then((response) => {
        setBeforeData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`/getEmail?name=${isUser}`)
      .then((response) => {
        getEmail(response.data[0].email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isUser, email]);
  // useEffect(() => {}, [email, isUser]);

  return (
    <S.out>
      <Header />
      <S.container>
        {nowRent ? (
          // 대여목록
          <S.row>
            <Cfonts size={30}>대여 목록</Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList()}
            >
              이전 대여
            </Cfonts>
          </S.row>
        ) : (
          <S.row>
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList()}
            >
              대여 목록
            </Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts size={30}>이전 대여</Cfonts>
          </S.row>
        )}
        {nowRent ? (
          <S.listBox>
            <S.table>
              <S.tableRow>
                <S.tableHeader>모델명</S.tableHeader>
                <S.tableHeader>차량번호</S.tableHeader>
                <S.tableHeader>대여 날짜</S.tableHeader>
                <S.tableHeader>반납 예정일</S.tableHeader>
                <S.tableHeader>
                  예상 결제 금액
                  <br />
                  (금일 / 계약일)
                </S.tableHeader>
                <S.tableHeader>결제</S.tableHeader>
              </S.tableRow>
              {/*  */}
              {data &&
                data.map((car, index) => (
                  <S.tableRow key={index}>
                    <S.tableData>{car.modelName}</S.tableData>
                    <S.tableData>{car.licensePlateNo}</S.tableData>
                    <S.tableData>
                      {convertDateFormat(car.startDate)}
                    </S.tableData>
                    <S.tableData>{convertDateFormat(car.endDate)}</S.tableData>
                    <S.tableData>
                      {car.rentRatePerDayAccumulated1}원 /{" "}
                      {car.rentRatePerDayAccumulated2}원
                    </S.tableData>
                    <S.tableData>
                      <S.area>
                        <S.returnbtn
                          onClick={async () => {
                            try {
                              await axios.get(
                                `/onPay?name=${isUser}&payment=${car.rentRatePerDayAccumulated1}&licensePlateNo=${car.licensePlateNo}`
                              );
                              await axios.get(
                                `/cancelReserve?licensePlateNo=${
                                  car.licensePlateNo
                                }&startDate=${convertDateFormat(
                                  car.startDate
                                )}&name=${isUser}`
                              );
                              await emailjs
                                .send(
                                  "service_se1yive",
                                  "template_qslwsnm",
                                  {
                                    name: isUser,
                                    modelName: car.modelName,
                                    dateReturned: convertDateFormat(new Date()),
                                    payment:
                                      car.rentRatePerDayAccumulated1.toString(),
                                    email: email,
                                  },
                                  "zD25jO1PgJcfnQ-YV"
                                )
                                .then(
                                  (result) => {
                                    console.log(result.text);
                                  },
                                  (error) => {
                                    console.log(error.text);
                                  }
                                );
                              document.location.href = "/myrental";
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          <Cfonts size={10} color="white">
                            결제
                          </Cfonts>
                        </S.returnbtn>
                      </S.area>
                    </S.tableData>
                  </S.tableRow>
                ))}

              {/*  */}
            </S.table>
          </S.listBox>
        ) : (
          <S.listBox>
            <S.table>
              <S.tableRow>
                <S.tableHeader>모델명</S.tableHeader>
                <S.tableHeader>차량번호</S.tableHeader>
                <S.tableHeader>대여 날짜</S.tableHeader>
                <S.tableHeader>반납 일</S.tableHeader>
                <S.tableHeader>결제 금액</S.tableHeader>
              </S.tableRow>
              {/*  */}

              {beforeData &&
                beforeData.map((car, index) => (
                  <S.tableRow key={index}>
                    <S.tableData>{car.modelName}</S.tableData>
                    <S.tableData>{car.licensePlateNo}</S.tableData>
                    <S.tableData>
                      {convertDateFormat(car.dateRented)}
                    </S.tableData>
                    <S.tableData>
                      {convertDateFormat(car.dateReturned)}
                    </S.tableData>
                    <S.tableData>{car.payment}원</S.tableData>
                  </S.tableRow>
                ))}

              {/*  */}

              {/*  */}
            </S.table>
          </S.listBox>
        )}
      </S.container>
    </S.out>
  );
};

const S = {
  out: styled.div`
    background-color: #fff;
    /* padding-inline: 24px; */
    height: 100%;
    overflow: hidden;
  `,
  container: styled.div`
    padding-inline: 100px;
    height: 100%;
    margin-top: 20px;
  `,
  row: styled.div`
    display: flex;
  `,
  listBox: styled.div`
    background-color: ${() => BgGray};
    width: 100%;
    height: 70%;
    overflow: scroll;
  `,
  table: styled.table`
    width: 100%;
    border-collapse: collapse;
  `,
  tableRow: styled.tr`
    &:nth-child(even) {
      background-color: ${BgGray};
    }
  `,
  tableHeader: styled.th`
    padding: 10px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid ${CnuBlue};
  `,
  tableData: styled.td`
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid ${LightGray};
  `,
  area: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
  returnbtn: styled.div`
    background-color: green;
    width: 50%;
    padding: 5px;
    cursor: pointer;
  `,
};

export default RentalList;
