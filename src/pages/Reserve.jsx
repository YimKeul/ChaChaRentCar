import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Header,
  Cfonts,
  LightGray,
  CnuBlue,
  OpBlue,
  CarCard,
} from "../components";
import * as carImages from "../images";
// import { 모닝, 테슬리, 싼타페, K5, 카니발 } from "../images";
import { useLocation, Link } from "react-router-dom";
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
  const location = useLocation();
  const [startDate, setStartDate] = useState(location.state.startDate);
  const [endDate, setEndDate] = useState(location.state.endDate);
  const [filter, setFilter] = useState(location.state.filter);

  const handleAll = () => {
    setFilter(["전체"]);
  };

  const handleclick = () => {
    console.log(filter);
  };

  const convertDateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // function urlEncode(str) {
  //   return encodeURIComponent(str);
  // }
  // function urlDecode(str) {
  //   return decodeURIComponent(str);
  // }

  const [data, setData] = useState();
  useEffect(() => {
    // console.log(convertDateFormat(startDate));
    // console.log(convertDateFormat(endDate));
    // console.log(filter);

    if (filter[0] === "전체") {
      axios
        .get(
          `/allcar?startDate=${convertDateFormat(
            startDate
          )}&endDate=${convertDateFormat(endDate)}`
        )
        .then((response) => {
          console.log(response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

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
    <div>
      <Header />

      <S.ContainerRow>
        <S.LeftHalf>
          {data &&
            data.map((car, index) => (
              <CarCard
                key={index}
                carimg={carImageMap[car.modelName]}
                name={car.modelName}
                type={car.vehicleType}
                fuel={car.fuel}
                numberOfSeats={car.numberOfSeats}
                rentRatePerDay={car.rentRatePerDay}
                options={car.options}
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

            <S.ButtonBox
              onClick={() => {
                handleclick();
              }}
            >
              <Cfonts color="white" size={30}>
                다시 검색하기
              </Cfonts>
            </S.ButtonBox>
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
