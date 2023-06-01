import React, { useState, useEffect } from "react";
import {
  MHeader,
  Cfonts,
  LightGray,
  CnuBlue,
  BgGray,
  convertDateFormat,
} from "../components";
import styled from "styled-components";
import axios from "axios";
const Manager = () => {
  const [showList, isShowList] = useState("1");
  const handleList = (type) => {
    isShowList(type);
  };

  const [man1, setMan1] = useState();
  const [man2, setMan2] = useState();
  const [man3, setMan3] = useState();
  useEffect(() => {
    axios
      .get(`/man1`)
      .then((response) => {
        setMan1(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`/man2`)
      .then((response) => {
        setMan2(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`/man3`)
      .then((response) => {
        setMan3(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("1", man1);
    console.log("2", man2);
    console.log("3", man3);
  });

  return (
    <S.out>
      <MHeader />
      <S.container>
        {showList === "1" && (
          <S.row>
            <Cfonts size={30}>질의 1</Cfonts>

            <span style={{ paddingInline: "16px" }} />
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList("2")}
            >
              질의 2
            </Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList("3")}
            >
              질의 3
            </Cfonts>
          </S.row>
        )}

        {showList === "2" && (
          <S.row>
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList("1")}
            >
              질의 1
            </Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts size={30}>질의 2</Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList("3")}
            >
              질의 3
            </Cfonts>
          </S.row>
        )}

        {showList === "3" && (
          <S.row>
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList("1")}
            >
              질의 1
            </Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts
              size={30}
              color={LightGray}
              style={{ cursor: "pointer" }}
              onClick={() => handleList("2")}
            >
              질의 2
            </Cfonts>
            <span style={{ paddingInline: "16px" }} />
            <Cfonts size={30}>질의 3</Cfonts>
          </S.row>
        )}

        {showList === "1" && (
          <S.listBox>
            <Cfonts size={20}>
              join을 활용한 이전 대여 내역과 현 예약 정보를 더한 횟수를
              내림차순으로 정렬
            </Cfonts>
            <S.table style={{ marginTop: "20px" }}>
              <S.tableRow>
                <S.tableHeader>고유 아이디</S.tableHeader>
                <S.tableHeader>이름</S.tableHeader>
                <S.tableHeader>총 횟수</S.tableHeader>
              </S.tableRow>

              {man1 &&
                man1.map((data, index) => (
                  <S.tableRow key={index}>
                    <S.tableData>{data.CNO}</S.tableData>
                    <S.tableData>{data.NAME}</S.tableData>
                    <S.tableData>{data.TotalCount}</S.tableData>
                  </S.tableRow>
                ))}
            </S.table>
          </S.listBox>
        )}
        {showList === "2" && (
          <S.listBox>
            <Cfonts size={20}>
              그룹 함수를 사용한 이전 대여 내역과 현 예약 정보를 더한 정보에서
              가장 많이 빌린 렌터카의 차 번호 내림차순 정렬
            </Cfonts>
            <S.table style={{ marginTop: "20px" }}>
              <S.tableRow>
                <S.tableHeader>차량 번호</S.tableHeader>
                <S.tableHeader>총 횟수</S.tableHeader>
              </S.tableRow>
              {man2 &&
                man2.map((data, index) => (
                  <S.tableRow key={index}>
                    <S.tableData>{data.LICENSEPLATENO}</S.tableData>
                    <S.tableData>{data.RENTAL_COUNT}</S.tableData>
                  </S.tableRow>
                ))}
            </S.table>
          </S.listBox>
        )}
        {showList === "3" && (
          <S.listBox>
            <Cfonts size={20}>
              윈도우 함수를 사용하 각 차량별 최근 대여 및 예약자 정보
            </Cfonts>
            <S.table style={{ marginTop: "20px" }}>
              <S.tableRow>
                <S.tableHeader>차량 번호</S.tableHeader>
                <S.tableHeader>고유 아이디</S.tableHeader>
                <S.tableHeader>이름</S.tableHeader>
                <S.tableHeader>이메일</S.tableHeader>
                <S.tableHeader>예약일</S.tableHeader>
                <S.tableHeader>대여일</S.tableHeader>
                <S.tableHeader>종료일</S.tableHeader>
              </S.tableRow>
              {man3 &&
                man3.map((data, index) => (
                  <S.tableRow key={index}>
                    <S.tableData>{data.LICENSEPLATENO}</S.tableData>
                    <S.tableData>{data.CNO}</S.tableData>
                    <S.tableData>{data.NAME}</S.tableData>
                    <S.tableData>{data.EMAIL}</S.tableData>
                    <S.tableData>
                      {convertDateFormat(data.RESERVEDATE)}
                    </S.tableData>
                    <S.tableData>
                      {convertDateFormat(data.STARTDATE)}
                    </S.tableData>
                    <S.tableData>{convertDateFormat(data.ENDDATE)}</S.tableData>
                  </S.tableRow>
                ))}
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
};

export default Manager;
