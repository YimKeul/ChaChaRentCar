import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Cfonts } from "../components";
import { chacharentcar } from "../images";

const MHeader = () => {
  return (
    <S.container>
      <S.logoBox>
        <Link to="/">
          <img src={chacharentcar} alt="logo" />
        </Link>
      </S.logoBox>
      <S.navBox>
        <Cfonts size={30}>관리자페이지</Cfonts>
      </S.navBox>
    </S.container>
  );
};

const S = {
  container: styled.div`
    display: flex;
    padding-inline: 24px;
    flex: 1;
    align-items: center;
    background-color: #fff;
  `,

  logoBox: styled.div`
    justify-content: left;
  `,
  navBox: styled.div`
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  `,

  logBox: styled.div`
    display: flex;
    justify-content: right;
  `,

  navLink: styled.a`
    text-decoration: none;
  `,

  userBox: styled.div`
    text-align: right;
  `,
  logOutBtn: styled.div`
    cursor: pointer;
  `,
};

export default MHeader;
