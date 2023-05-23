import React, { useState } from "react";
import { Header, Cfonts, LightGray, CnuBlue, BgGray } from "../components";
import styled from "styled-components";
const RentalList = () => {
  const [nowRent, isNowRent] = useState(true);
  const handleList = () => {
    isNowRent(!nowRent);
  };

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
                <S.tableHeader>예상 결제 금액</S.tableHeader>
                <S.tableHeader>반납</S.tableHeader>
              </S.tableRow>
              <S.tableRow>
                <S.tableData>모델명 1</S.tableData>
                <S.tableData>차량번호 1</S.tableData>
                <S.tableData>대여날짜 1</S.tableData>
                <S.tableData>반납 예정일 1</S.tableData>
                <S.tableData>예상 결제 금액1</S.tableData>
                <S.tableData>반납 버튼 1</S.tableData>
              </S.tableRow>
              <S.tableRow>
                <S.tableData>모델명 2</S.tableData>
                <S.tableData>차량번호 2</S.tableData>
                <S.tableData>대여날짜 2</S.tableData>
                <S.tableData>반납 예정일 2</S.tableData>
                <S.tableData>예상 결제 금액2</S.tableData>
                <S.tableData>반납 버튼 2</S.tableData>
              </S.tableRow>
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
              <S.tableRow>
                <S.tableData>모델명 1</S.tableData>
                <S.tableData>차량번호 1</S.tableData>
                <S.tableData>대여날짜 1</S.tableData>
                <S.tableData>반납 일 1</S.tableData>
                <S.tableData>결제 금액 1</S.tableData>
              </S.tableRow>
              <S.tableRow>
                <S.tableData>모델명 2</S.tableData>
                <S.tableData>차량번호 2</S.tableData>
                <S.tableData>대여날짜 2</S.tableData>
                <S.tableData>반납 일 2</S.tableData>
                <S.tableData>결제 금액 2</S.tableData>
              </S.tableRow>
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
    text-align: left;
    border-bottom: 1px solid ${CnuBlue};
  `,
  tableData: styled.td`
    padding: 10px;
    border-bottom: 1px solid ${LightGray};
  `,
};

export default RentalList;
