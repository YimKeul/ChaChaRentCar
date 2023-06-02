import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Manager,
  Login,
  Reserve,
  ReserveList,
  RentalList,
} from "../src/pages";

const App = () => {
  const [isUser, setUser] = useState();
  useEffect(() => {
    setUser(sessionStorage.getItem("userId"));
  }, [isUser]);

  return (
    <Routes>
      {isUser === "관리자" ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/Manager" element={<Manager />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/myreserve" element={<ReserveList />} />
          <Route path="/myrental" element={<RentalList />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/myreserve" element={<ReserveList />} />
          <Route path="/myrental" element={<RentalList />} />
        </>
      )}
    </Routes>
  );
};

export default App;
