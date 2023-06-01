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
    setUser(sessionStorage.getItem("userId"));

    axios
      .get(
        `/reserveList?name=${isUser}
      `
      )
      .then((response) => {
        setData(response.data);
        console.log(response.data);
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
            <S.tableRow>
              <S.tableHeader>모델명</S.tableHeader>
              <S.tableHeader>차량 번호</S.tableHeader>
              <S.tableHeader>대여 날짜</S.tableHeader>
              <S.tableHeader>반납 예정일</S.tableHeader>
              <S.tableHeader>취소</S.tableHeader>
            </S.tableRow>
            {data &&
              data.map((car, index) => (
                <S.tableRow key={index}>
                  <S.tableData>{car.modelName}</S.tableData>
                  <S.tableData>{car.licensePlateNo}</S.tableData>
                  <S.tableData>{convertDateFormat(car.startDate)}</S.tableData>
                  <S.tableData>{convertDateFormat(car.endDate)}</S.tableData>
                  <S.tableData>
                    <S.area>
                      <S.deletebtn
                        onClick={() => {
                          axios
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
