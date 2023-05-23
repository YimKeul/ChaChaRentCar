import React, { useState } from "react";
import { MHeader, Cfonts, LightGray, CnuBlue, BgGray } from "../components";
import styled from "styled-components";
const Manager = () => {
  const [showList, isShowList] = useState("1");
  const handleList = (type) => {
    isShowList(type);
  };

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

        {showList === "1" && <S.listBox>1번질의</S.listBox>}
        {showList === "2" && <S.listBox>2번질의</S.listBox>}
        {showList === "3" && <S.listBox>3번질의</S.listBox>}
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

export default Manager;
