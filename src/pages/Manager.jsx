import React, { useState, useEffect } from "react";
import { MHeader, Cfonts } from "../components";
const Manager = () => {
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleButtonClick = (button) => {
    if (selectedButtons.includes(button)) {
      setSelectedButtons(selectedButtons.filter((item) => item !== button));
    } else {
      setSelectedButtons([...selectedButtons, button]);
    }
  };

  useEffect(() => {
    console.log(selectedButtons);
  }, [selectedButtons]);

  return (
    <div>
      <MHeader />
      <h1>선택한 버튼 개수: {selectedButtons.length}</h1>
      <button onClick={() => handleButtonClick("A")}>A</button>
      <button onClick={() => handleButtonClick("B")}>B</button>
      <button onClick={() => handleButtonClick("C")}>C</button>
    </div>
  );
};

export default Manager;