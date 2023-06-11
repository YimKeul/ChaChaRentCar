import React, { useState } from "react";
import { Header, Cfonts, LightGray, CnuBlue } from "../components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { great } from "../images";
import axios from "axios";
const Login = () => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  // login 버튼 클릭 이벤트
  const onClickLogin = () => {
    axios
      .post("/onLogin", null, {
        params: {
          inputId: inputId,
          inputPw: inputPw,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.cno === undefined) {
          alert("회원정보가 없습니다");
        } else {
          sessionStorage.setItem("userId", res.data.name);
          sessionStorage.setItem("userCNO", res.data.cno);
          sessionStorage.setItem("userEmail", res.data.email);
          document.location.href = "/";
          // 작업 완료 되면 페이지 이동(새로고침)
        }
      })
      .catch();
  };

  return (
    <S.container>
      <Header />
      <S.row>
        <div style={{ flex: 1 }}></div>
        <S.formContainer>
          <S.inputGroup>
            <S.input
              type="text"
              id="id"
              placeholder="아이디"
              onChange={handleInputId}
            />
          </S.inputGroup>
          <S.inputGroup>
            <S.input
              type="password"
              id="password"
              placeholder="비밀번호"
              onChange={handleInputPw}
            />
          </S.inputGroup>
          <S.button
            onClick={() => {
              onClickLogin();
            }}
          >
            <Cfonts size={30} color="white">
              로그인
            </Cfonts>
          </S.button>
          <Cfonts>
            관리자이신가요?
            <Link to="/manager" style={{ textDecoration: "none" }}>
              <span style={{ color: `${CnuBlue}` }}>
                관리자 페이지 이동하기
              </span>
            </Link>
          </Cfonts>
        </S.formContainer>
        <S.imgBox>
          <S.img src={great} alt="logo" />
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
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  img: styled.img`
    object-fit: contain;
    width: 100%;
    height: 45%;
  `,
};

export default Login;
