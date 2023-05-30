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

const CarCard = ({
  carimg,
  name,
  type,
  fuel,
  numberOfSeats,
  LICENSEPLATENO,
  rentRatePerDay,
  options,
  startDate,
  endDate,
}) => {
  const [isUser, setUser] = useState();
  useEffect(() => {
    setUser(sessionStorage.getItem("userId"));
  }, [isUser]);

  const reserve = () => {
    axios
      .get(
        `/reserve?licensePlateNo=${LICENSEPLATENO}&startDate=${convertDateFormat(
          startDate
        )}&reserveDate=${convertDateFormat(
          new Date()
        )}&endDate=${convertDateFormat(endDate)}&name=${isUser}
    `
      )
      .then((response) => {
        // setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    document.location.href = "/reserve";
  };

  return (
    <S.container>
      <S.cardBox>
        <S.imgBox>
          <img src={carimg} alt="santafe" />
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
          <S.rightArea>
            <S.reserveBtn
              onClick={() => {
                reserve();
              }}
            >
              <Cfonts size={30} color="white">
                예약하기
              </Cfonts>
            </S.reserveBtn>
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
};

export default CarCard;
