import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (sessionStorage.getItem("userId") === null) {
      // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
    } else {
      // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
      // 로그인 상태 변경
      setLogin(true);
    }
  }, [isLogin]);

  const logOut = () => {
    sessionStorage.removeItem("userId");
    // App 으로 이동(새로고침)
    document.location.href = "/";
  };

  return (
    <S.container>
      <S.logoBox>
        <Link to="/">
          <img src={chacharentcar} alt="logo" />
        </Link>
      </S.logoBox>

      {isLogin ? (
        <S.navBox>
          <Link
            to="/myreserve"
            style={{ textDecoration: "none", marginRight: "40px" }}
          >
            <Cfonts size={30}>예약 내역</Cfonts>
          </Link>
          <Link to="/myrental" style={{ textDecoration: "none" }}>
            <Cfonts size={30}>대여 내역</Cfonts>
          </Link>
        </S.navBox>
      ) : (
        <S.navBox>
          <Link
            to="/login"
            style={{ textDecoration: "none", marginRight: "40px" }}
          >
            <Cfonts size={30}>예약 내역</Cfonts>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Cfonts size={30}>대여 내역</Cfonts>
          </Link>
        </S.navBox>
      )}

      <S.logBox>
        {isLogin ? (
          <S.userBox>
            <Cfonts size={20} color={LightGray}>
              {sessionStorage.getItem("userId")}님
            </Cfonts>
            <S.logOutBtn onClick={() => logOut()}>
              <Cfonts size={15} color={CnuBlue}>
                로그아웃
              </Cfonts>
            </S.logOutBtn>
          </S.userBox>
        ) : (
          <Link
            to="/login"
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
    position: sticky;
    top: 0;
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
    padding-left: 40px;
    /* justify-content: space-; */
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
