import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Header,
  Cfonts,
  LightGray,
  CnuBlue,
  OpBlue,
  CarCard,
  convertDateFormat,
} from "../components";
import * as carImages from "../images";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineClockCircle, AiFillCar } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import axios from "axios";

const carImageMap = {
  싼타페: carImages.santafe,
  K5: carImages.K5,
  모닝: carImages.morning,
  TESLA: carImages.tesla,
  카니발: carImages.kanival,
};
const Reserve = () => {
  // home.jsx에서 변수값 전달받음
  const location = useLocation();
  const [nowDate] = useState(location.state.startDate);
  const [startDate, setStartDate] = useState(location.state.startDate);
  const [endDate, setEndDate] = useState(location.state.endDate);
  const [filter, setFilter] = useState(location.state.filter);

  // 조회 결과 데이터를 저장하는 변수
  const [data, setData] = useState();
  // cno 저장 변수
  const [isCno, setCno] = useState();

  // 예약/대여 날짜 저장 배열과 중복검사용 변수
  const [isCheckReserve, setCheckReserve] = useState([]);
  const [isCheck, setCheck] = useState(location.state.isCheck);

  const handleAll = () => {
    setFilter(["전체"]);
  };

  // 배열 변수 값을 "," 추가해 쿼리문을 실핼하기 위해 문자 포맷팅 함수
  const formatArrayToString = (arr) => {
    return arr.join(",");
  };

  // 예약 버튼 함수
  const searchRentCar = () => {
    // 만약 전체인 경우, 시작날짜, 종료날짜를 입력으로 예약 가능한 차량 조회 함수
    if (filter[0] === "전체") {
      axios
        .get(
          `/searchRentCar?startDate=${convertDateFormat(
            startDate
          )}&endDate=${convertDateFormat(endDate)}`
        )
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // 그 외 차종까지 추가해 예약 가능한 차량 조회 함수
      axios
        .get(
          `/searchRentCarOps?startDate=${convertDateFormat(
            startDate
          )}&endDate=${convertDateFormat(
            endDate
          )}&vehicleType=${formatArrayToString(filter)}
          `
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // 조회 결과 데이터를 저장하는 변수
  useEffect(() => {
    searchRentCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCno(sessionStorage.getItem("userCNO"));
    axios
      .get(`/checkReserve?cno=${isCno}`)
      .then((response) => {
        setCheckReserve(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isCno]);

  // 예약 / 대여 중복 검사
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

  // home.jsx와 동일
  const handleFilter = (button) => {
    if (button === "전체") {
      setFilter(["전체"]);
    } else if (filter.includes("전체")) {
      setFilter([button]);
    } else if (filter.includes(button)) {
      setFilter(filter.filter((item) => item !== button));
    } else {
      setFilter([...filter, button]);
    }
  };

  return (
    <div>
      <Header />
      <S.ContainerRow>
        <S.LeftHalf>
          {/* 조회 결과 데이터를 map 함수를 통해 반복 렌더링 */}
          {data &&
            data.map((car, index) => (
              <CarCard
                key={index}
                carimg={carImageMap[car.modelName]}
                name={car.modelName}
                licensePlateNo={car.licensePlateNo}
                type={car.vehicleType}
                fuel={car.fuel}
                numberOfSeats={car.numberOfSeats}
                rentRatePerDay={car.rentRatePerDay}
                options={car.optionName}
                startDate={startDate}
                endDate={endDate}
                isCheck={isCheck}
              />
            ))}
        </S.LeftHalf>

        <S.RightHalf>
          <S.RightContainer>
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

            {nowDate <= startDate && startDate <= endDate ? (
              <S.ButtonBox
                onClick={async () => {
                  try {
                    searchRentCar();
                  } catch {
                    console.log("error");
                  }
                }}
              >
                <Cfonts color="white" size={30}>
                  다시 검색하기
                </Cfonts>
              </S.ButtonBox>
            ) : (
              <S.ButtonBox
                onClick={() => {
                  alert("날짜를 확인해주세요");
                }}
              >
                <Cfonts color="white" size={30}>
                  다시 검색하기
                </Cfonts>
              </S.ButtonBox>
            )}
          </S.RightContainer>
        </S.RightHalf>
      </S.ContainerRow>
    </div>
  );
};

const S = {
  ContainerRow: styled.div`
    display: flex;
    height: 100%;
    width: 100%;
  `,

  LeftHalf: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  `,

  cardBox: styled.div`
    display: flex;
    width: 80%;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background-color: ${() => OpBlue};
    margin-block: 16px;
    border-radius: 15px;
  `,
  imgBox: styled.div`
    display: flex;
    flex: 2;
    justify-content: center;
    align-items: centers;
  `,
  textBox: styled.div`
    display: flex;
    flex: 1;
    padding-inline: 32px;
    padding-block: 8px;
    background-color: white;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  `,
  leftArea: styled.div`
    display: flex;
    flex-direction: column;
    flex: 4;
  `,
  rightArea: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  `,
  reserveBtn: styled.div`
    background-color: ${() => CnuBlue};
    padding: 16px;
    border-radius: 15px;
    cursor: pointer;
  `,

  RightHalf: styled.div`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,

  RightContainer: styled.div`
    position: sticky;
    left: 65vw;
    top: 30%;
    background-color: #fff;
    width: 520px;
    border-radius: 15px;
    @media screen and (max-width: 1440px) {
      left: 58vw;
    }
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
};

export default Reserve;
