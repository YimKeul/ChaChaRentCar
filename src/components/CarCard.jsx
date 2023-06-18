import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Cfonts,
  CnuBlue,
  OpBlue,
  SubGray,
  convertDateFormat,
} from "../components";
import axios from "axios";
import { Link } from "react-router-dom";
const CarCard = ({
  carimg,
  name,
  type,
  fuel,
  numberOfSeats,
  licensePlateNo,
  rentRatePerDay,
  options,
  startDate,
  endDate,
  isCheck,
}) => {
  const [isUser, setUser] = useState();

  useEffect(() => {
    console.log("carCard", isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUser(sessionStorage.getItem("userId"));
  }, [isUser]);

  const reserve = () => {
    axios
      .get(
        `/reserve?licensePlateNo=${licensePlateNo}&startDate=${convertDateFormat(
          startDate
        )}&reserveDate=${convertDateFormat(
          new Date()
        )}&endDate=${convertDateFormat(endDate)}&name=${isUser}
    `
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const update = () => {
    axios
      .get(`/updateRentCar?licensePlateNo=${licensePlateNo}&userName=${isUser}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <S.container>
      <S.cardBox>
        <S.imgBox>
          <S.img src={carimg} alt="사진" />
        </S.imgBox>
        <S.textBox>
          <S.leftArea>
            <Cfonts size={50}>{name}</Cfonts>
            <Cfonts size={30} color={SubGray}>
              {type}
            </Cfonts>
            <Cfonts size={15} color={SubGray}>
              {fuel} / {numberOfSeats}인승 / 일일 {rentRatePerDay}원 / {options}
            </Cfonts>
          </S.leftArea>
          {/* 중복된 예약/대여 내역이 없는 경우 예약 */}
          {/* 중복된 예약/대여 내역이 있는 경우 알림표시 */}
          {/* 로그인 안하고 예약 누를시 로그인 화면 이동 */}
          <S.rightArea>
            {isUser !== null ? (
              <>
                {isCheck === true ? (
                  <div>
                    <S.reserveBtn
                      onClick={async () => {
                        try {
                          await reserve();
                          console.log("reserve");
                          await update();
                          console.log("update");
                          document.location.href = "/reserve";
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    >
                      <Cfonts size={30} color="white">
                        예약하기
                      </Cfonts>
                    </S.reserveBtn>
                  </div>
                ) : (
                  <div>
                    <S.reserveBtn
                      onClick={() => {
                        alert("중복된 예약 / 대여한 차량 정보가 있습니다.");
                      }}
                    >
                      <Cfonts size={30} color="white">
                        예약하기
                      </Cfonts>
                    </S.reserveBtn>
                  </div>
                )}
              </>
            ) : (
              <Link to="/Login" style={{ textDecoration: "none" }}>
                <S.reserveBtn>
                  <Cfonts size={30} color="white">
                    예약하기
                  </Cfonts>
                </S.reserveBtn>
              </Link>
            )}
          </S.rightArea>
        </S.textBox>
      </S.cardBox>
    </S.container>
  );
};

const S = {
  container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
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
  img: styled.img`
    width: 100%;
    height: 100%;
    @media screen and (max-width: 1440px) {
      width: 80%;
      height: 100%;
    }
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
    @media screen and (max-width: 1440px) {
      flex: 2;
    }
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
};

export default CarCard;
