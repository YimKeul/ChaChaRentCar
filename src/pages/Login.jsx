import React, { useState } from "react";
import { Header, Cfonts, LightGray, CnuBlue } from "../components";
import styled from "styled-components";
import { great } from "../images";
import { Link } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  // input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
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
        if (res.data.email === undefined) {
          alert("회원정보가 없습니다");
        } else {
          sessionStorage.setItem("userId", res.data.name);
          // 작업 완료 되면 페이지 이동(새로고침)
          document.location.href = "/";
        }

        console.log("res.data.email :: ", res.data.email);
        console.log("res.data.passwd :: ", res.data.passwd);
        console.log("res.data.name :: ", res.data.name);
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
              placeholder="이메일"
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
