import React from "react";
import { Header, Cfonts, LightGray, CnuBlue } from "../components";
import styled from "styled-components";
import { great } from "../images";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <S.container>
      <Header />
      <S.row>
        <div style={{ flex: 1 }}></div>
        <S.formContainer>
          <S.inputGroup>
            <S.input type="text" id="id" placeholder="아이디" />
          </S.inputGroup>
          <S.inputGroup>
            <S.input type="password" id="password" placeholder="비밀번호" />
          </S.inputGroup>
          <S.button>
            <Cfonts size={30} color="white">
              로그인
            </Cfonts>
          </S.button>

          <Cfonts>
            관리자이신가요?
            <Link to="/manager" style={{ textDecoration: "none" }}>
              <span
                style={{ cursor: "pointer", color: `${CnuBlue}` }}
                onClick={() => {}}
              >
                관리자 페이지 이동하기
              </span>
            </Link>
          </Cfonts>
        </S.formContainer>
        <S.imgBox>
          <img src={great} alt="logo" />
        </S.imgBox>
      </S.row>
    </S.container>
  );
};

const S = {
  container: styled.div`
    overflow: hidden;
    height: 100%;
  `,
  row: styled.div`
    display: flex;
    height: 100%;
    /* justify-content: center; */
    /* margin-top: 160px; */
  `,
  formContainer: styled.div`
    display: flex;
    flex: 2;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  inputGroup: styled.div`
    margin-bottom: 50px;
  `,
  input: styled.input`
    padding: 16px;
    width: 30vw;
    border-radius: 15px;
    border-color: ${() => LightGray};
  `,
  button: styled.div`
    display: flex;
    padding: 16px;
    border-radius: 15px;
    width: 30vw;
    background-color: ${() => CnuBlue};
    color: #fff;
    align-items: center;
    justify-content: center;
    margin-bottom: 80px;
    cursor: pointer;
  `,

  imgBox: styled.div`
    margin-top: 80px;
    flex: 1;
  `,
};

export default Login;
