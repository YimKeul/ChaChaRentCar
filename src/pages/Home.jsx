import React, { useState, useEffect } from "react";
import { Header, Cfonts } from "../components";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { CnuBlue, ChaCha, LightGray, convertDateFormat } from "../components";
import { bgimg } from "../images";
import { AiOutlineClockCircle, AiFillCar } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import axios from "axios";

const Home = () => {
  //날짜 저장 변수
  const [nowDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // 차종 저장 배열
  const [filter, setFilter] = useState(["전체"]);

  const [isCno, setCno] = useState();

  // 예약/대여 날짜 저장 배열과 중복검사용 변수
  const [isCheckReserve, setCheckReserve] = useState([]);
  const [isCheck, setCheck] = useState();

  // 처음 화면 렌더링시 차종 저장 배열에 "전체" 저장
  useEffect(() => {
    setFilter(["전체"]);
  }, []);

  // cno를 기준으로 Reserve테이블에 startDate, endDate 요청하는 쿼리문
  useEffect(() => {
    setCno(sessionStorage.getItem("userCNO"));
    axios
      .get(`/checkReserve?cno=${isCno}`)
      .then((response) => {
        setCheckReserve(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isCno]);

  //some 함수를 통해 날짜 중복 검사
  useEffect(() => {
    const isWithRange = isCheckReserve.some((data) => {
      return (
        (convertDateFormat(startDate) >= convertDateFormat(data.startDate) &&
          convertDateFormat(startDate) <= convertDateFormat(data.endDate)) ||
        (convertDateFormat(endDate) >= convertDateFormat(data.startDate) &&
          convertDateFormat(endDate) <= convertDateFormat(data.endDate)) ||
        (convertDateFormat(startDate) <= convertDateFormat(data.startDate) &&
          convertDateFormat(endDate) >= convertDateFormat(data.endDate))
      );
    });
    // "true : 안겹침, 예약 가능", "false : 겹침,예약불가"
    setCheck(!isWithRange);
  }, [startDate, endDate, isCheckReserve]);

  // filter값을 "전체"로 바꾸는 함수
  const handleAll = () => {
    setFilter(["전체"]);
  };

  const handleFilter = (button) => {
    if (button === "전체") {
      // '전체' 버튼을 선택한 경우, filter 배열을 초기화하여 '전체'만 포함하도록 합니다.
      setFilter(["전체"]);
    } else if (filter.includes("전체")) {
      // '전체' 버튼을 선택한 후 다른 버튼을 선택한 경우, '전체'를 제외한 나머지 버튼들만으로 새로운 배열을 생성합니다.
      setFilter([button]);
    } else if (filter.includes(button)) {
      // 이미 선택된 버튼을 다시 선택한 경우, 해당 버튼을 filter에서 제외합니다.
      setFilter(filter.filter((item) => item !== button));
    } else {
      // 새로운 버튼을 선택한 경우, 해당 버튼을 filter에 추가합니다.
      setFilter([...filter, button]);
    }
  };

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <Header />
      <S.outBox>
        <S.ContainerRow>
          <S.LeftHalf>
            <Cfonts color="white" size={100}>
              <span style={{ color: `${ChaCha}` }}>차차</span>와 함께
            </Cfonts>
            <Cfonts color="white" size={100}>
              다함께 차차차
            </Cfonts>
          </S.LeftHalf>
          <S.RightHalf>
            <S.RightContentBox>
              <S.row>
                <AiOutlineClockCircle
                  size={20}
                  style={{ paddingRight: "8px" }}
                />
                <Cfonts size={20}>예약 기간</Cfonts>
              </S.row>
              <S.row2>
                <div>
                  {/* 시작 날짜 선택할 수 있는 DatePicker */}
                  <DatePicker
                    showIcon
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
                <Cfonts size={20} style={{ paddingInline: "8px" }}>
                  ~
                </Cfonts>
                <div>
                  {/* 종료 날짜 선택할 수 있는 DatePicker */}
                  <DatePicker
                    showIcon
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
              </S.row2>
              <S.row>
                <S.row3>
                  <AiFillCar size={20} style={{ paddingRight: "8px" }} />
                  {/* 차종 선택 효과 , 클릭시 테두리 색 변경 및 filter 데이터 변경 */}
                  <Cfonts size={20}>
                    {filter.includes("전체")
                      ? "모든 차량"
                      : `${filter.length}개 선택`}
                  </Cfonts>
                </S.row3>
                <GrPowerReset
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleAll();
                  }}
                />
              </S.row>
              <S.row4>
                <S.btnBox
                  onClick={() => {
                    handleAll();
                  }}
                  className={filter.includes("전체") ? "active" : ""}
                >
                  <Cfonts size={20}>전체</Cfonts>
                </S.btnBox>
                <S.btnBox
                  onClick={() => {
                    handleFilter("소형");
                  }}
                  className={filter.includes("소형") ? "active" : ""}
                >
                  <Cfonts size={20}>소형</Cfonts>
                </S.btnBox>
                <S.btnBox
                  onClick={() => {
                    handleFilter("대형");
                  }}
                  className={filter.includes("대형") ? "active" : ""}
                >
                  <Cfonts size={20}>대형</Cfonts>
                </S.btnBox>
                <S.btnBox
                  onClick={() => {
                    handleFilter("전기차");
                  }}
                  className={filter.includes("전기차") ? "active" : ""}
                >
                  <Cfonts size={20}>전기차</Cfonts>
                </S.btnBox>
                <S.btnBox
                  onClick={() => {
                    handleFilter("승합");
                  }}
                  className={filter.includes("승합") ? "active" : ""}
                >
                  <Cfonts size={20}>승합</Cfonts>
                </S.btnBox>
                <S.btnBox
                  onClick={() => {
                    handleFilter("SUV");
                  }}
                  className={filter.includes("SUV") ? "active" : ""}
                >
                  <Cfonts size={20}>SUV</Cfonts>
                </S.btnBox>
              </S.row4>
            </S.RightContentBox>
            {/* 날짜 검색 조건 설정 */}
            {nowDate <= startDate && startDate <= endDate ? (
              // 조건에 맞는 경우 선택한 값들을 검색 페이지에 전달 후 화면 이동
              <Link
                to="/reserve"
                state={{
                  filter: filter,
                  nowDate: nowDate,
                  startDate: startDate,
                  endDate: endDate,
                  isCheck: isCheck,
                }}
                style={{ textDecoration: "none" }}
              >
                <S.ButtonBox>
                  <Cfonts color="white" size={30}>
                    차량 조회하고 예약하기
                  </Cfonts>
                </S.ButtonBox>
              </Link>
            ) : (
              // 조건에 맞지 않는 경우 경고창 띄움
              <S.ButtonBox
                onClick={() => {
                  alert("날짜를 확인해주세요");
                }}
              >
                <Cfonts color="white" size={30}>
                  차량 조회하고 예약하기
                </Cfonts>
              </S.ButtonBox>
            )}
          </S.RightHalf>
        </S.ContainerRow>
      </S.outBox>
    </div>
  );
};

const S = {
  outBox: styled.div`
    background-image: url(${bgimg});
    background-color: rgba(0, 0, 0, 0.3);
    background-blend-mode: multiply;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: inherit;
  `,
  ContainerRow: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
    width: 100%;
  `,

  LeftHalf: styled.div`
    flex-direction: column;
  `,
  LeftHalfSubTitle: styled.div`
    font-size: 30px;
    font-weight: 400;
  `,
  RightHalf: styled.div`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 520px;
    border-radius: 15px;
  `,
  RightContentBox: styled.div`
    flex: 1;
    padding: 24px;
  `,
  row: styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    margin-block: 8px;
  `,

  row2: styled.div`
    display: flex;
    align-items: center;
  `,
  row3: styled.div`
    display: flex;
    flex: 1;
    align-items: center;
  `,
  row4: styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  `,
  btnBox: styled.div`
    cursor: pointer;
    border: 2px solid ${() => LightGray};
    border-radius: 15px;
    text-align: center;
    flex: 0 0 25%;
    margin-right: 10px;
    margin-bottom: 10px;
    /* padding-inline: 8px; */
    &.active {
      border: 2px solid ${() => CnuBlue};
    }
  `,

  ButtonBox: styled.div`
    cursor: pointer;
    padding-block: 16px;
    text-align: center;
    background-color: ${() => CnuBlue};
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    width: 100%;
  `,

  Button: styled.div`
    background-color: ${() => CnuBlue};
    color: white;
    padding: 8px;
    width: 100px;
    text-align: center;
    font-weight: bold;
    /* cursor: pointer; */
  `,
};

export default Home;
