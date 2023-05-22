import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Cfonts, LightGray, CnuBlue } from "../components";
import { chacharentcar } from "../images";
import { MdPersonOutline } from "react-icons/md";

const Header = () => {
  const [isLogin, setLogin] = useState(false);

  const handleSetLogin = () => {
    setLogin(!isLogin);
  };

  return (
    <S.container>
      <S.logoBox>
        <Link to="/">
          <img src={chacharentcar} alt="logo" />
        </Link>
      </S.logoBox>

      <S.navBox>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Cfonts size={30}>예약</Cfonts>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Cfonts size={30}>예약 내역</Cfonts>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Cfonts size={30}>대여 내역</Cfonts>
        </Link>
      </S.navBox>
      <S.logBox>
        {isLogin ? (
          <S.userBox>
            <Cfonts size={20} color={LightGray}>
              000님
            </Cfonts>
            <S.logOutBtn onClick={() => handleSetLogin()}>
              <Cfonts size={15} color={CnuBlue}>
                로그아웃
              </Cfonts>
            </S.logOutBtn>
          </S.userBox>
        ) : (
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MdPersonOutline
              size={20}
              color={LightGray}
              style={{ paddingRight: "8px" }}
            />
            <Cfonts size={18} color={LightGray}>
              로그인
            </Cfonts>
          </Link>
        )}
      </S.logBox>
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

export default Header;
