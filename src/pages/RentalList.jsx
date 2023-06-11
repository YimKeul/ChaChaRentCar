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
  // 대여목록, 이전 대여목록 스위치 변수
  const [nowRent, isNowRent] = useState(true);

  const [isUser, setUser] = useState();
  const [data, setData] = useState();
  const [beforeData, setBeforeData] = useState();
  const [isemail, setEmail] = useState();

  const handleList = () => {
    isNowRent(!nowRent);
  };

  useEffect(() => {
    // 사용자 id, email을 가져옴, 이메일은 메일 보낼때 사용
    setUser(sessionStorage.getItem("userId"));
    setEmail(sessionStorage.getItem("userEmail"));

    // 대여 목록 조회 요청문
    // 사용자 정보를 통해 조회
    axios
      .get(`/rentalList?name=${isUser}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // 이전 대여 목록 조회 요청문
    // 사용자 정보를 통해 조회
    axios
      .get(`/rentalBeforeList?name=${isUser}`)
      .then((response) => {
        setBeforeData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isUser, isemail]);

  return (
    <S.out>
      <Header />
      <S.container>
        {nowRent ? (
          // 대여목록인경우
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
              <tbody>
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
                      <S.tableData>
                        {convertDateFormat(car.endDate)}
                      </S.tableData>
                      <S.tableData>
                        {car.rentRatePerDayAccumulated1}원 /{" "}
                        {car.rentRatePerDayAccumulated2}원
                      </S.tableData>
                      <S.tableData>
                        <S.area>
                          <S.returnbtn
                            // 반납 버튼
                            onClick={async () => {
                              //1) 이전 대여 목록에 클릭한 차량 저장
                              try {
                                await axios.get(
                                  `/onPay?name=${isUser}&payment=${car.rentRatePerDayAccumulated1}&licensePlateNo=${car.licensePlateNo}`
                                );
                                //2) 예약 테이블에서 해당 데이터 삭제
                                await axios.get(
                                  `/cancelReserve?licensePlateNo=${
                                    car.licensePlateNo
                                  }&startDate=${convertDateFormat(
                                    car.startDate
                                  )}&name=${isUser}`
                                );
                                //3) RentCar 테이블 갱신
                                await axios.get(
                                  `/updateDeleteRentCar?licensePlateNo=${car.licensePlateNo}`
                                );
                                // 4) 이메일 보내는 함수
                                await emailjs
                                  .send(
                                    "service_se1yive",
                                    "template_qslwsnm",
                                    {
                                      name: isUser,
                                      modelName: car.modelName,
                                      dateRented: convertDateFormat(
                                        car.startDate
                                      ),
                                      dateReturned: convertDateFormat(
                                        new Date()
                                      ),
                                      payment:
                                        car.rentRatePerDayAccumulated1.toString(),
                                      email: isemail,
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
              </tbody>
              {/*  */}
            </S.table>
          </S.listBox>
        ) : (
          // 이전 대여 목록인 경우
          <S.listBox>
            <S.table>
              <tbody>
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
              </tbody>
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
