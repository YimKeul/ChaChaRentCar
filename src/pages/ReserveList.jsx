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

const ReserveList = () => {
  const [isUser, setUser] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    // sessionStorage를 조회해 로그인 확인 및 회원 정보를 가져오는 코드
    setUser(sessionStorage.getItem("userId"));

    // 회원 정보와 일치하는 내역 중 예약 정보 데이터를 가져오는 코드
    axios
      .get(
        `/reserveList?name=${isUser}
      `
      )
      .then((response) => {
        setData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isUser]);

  return (
    <S.out>
      <Header />
      <S.container>
        <Cfonts size={30}>예약 내역</Cfonts>
        <S.listBox>
          <S.table>
            <tbody>
              <S.tableRow>
                <S.tableHeader>모델명</S.tableHeader>
                <S.tableHeader>차량 번호</S.tableHeader>
                <S.tableHeader>대여 날짜</S.tableHeader>
                <S.tableHeader>반납 예정일</S.tableHeader>
                <S.tableHeader>취소</S.tableHeader>
              </S.tableRow>
              {/* map함수를 통해 데이터 렌더링 */}
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
                      <S.area>
                        <S.deletebtn
                          // 예약 취소 버튼
                          onClick={async () => {
                            try {
                              // 1) 차량 번호, 대여 시작 날짜, 사용자 이름을 입력으로 Reserve 테이블에 해당하는 예약 데이터 삭제
                              await axios
                                .get(
                                  `/cancelReserve?licensePlateNo=${
                                    car.licensePlateNo
                                  }&startDate=${convertDateFormat(
                                    car.startDate
                                  )}&name=${isUser}`
                                )
                                .then((response) => {
                                  console.log(response.data);
                                })
                                .catch((error) => {
                                  console.error(error);
                                });
                              console.log("cancelReserve");
                              // 2) 차량 번호를 입력으로 Reserve RentCar테이블에 해당하는 예약 데이터 업데이트
                              await axios
                                .get(
                                  `/updateDeleteRentCar?licensePlateNo=${car.licensePlateNo}`
                                )
                                .then((response) => {
                                  console.log(response.data);
                                })
                                .catch((error) => {
                                  console.error(error);
                                });
                              console.log("updateRentcar");
                            } catch (error) {
                              console.log(error);
                            }
                            // 화면 새로고침으로 데이터 목록 갱신
                            document.location.href = "/myreserve";
                          }}
                        >
                          <Cfonts size={10} color="white">
                            취소
                          </Cfonts>
                        </S.deletebtn>
                      </S.area>
                    </S.tableData>
                  </S.tableRow>
                ))}
            </tbody>
          </S.table>
        </S.listBox>
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
  deletebtn: styled.div`
    background-color: red;
    width: 50%;
    padding: 5px;
    cursor: pointer;
  `,
};

export default ReserveList;
