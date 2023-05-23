import React, { useState } from "react";
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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Manager" element={<Manager />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reserve" element={<Reserve />} />
      <Route path="/myreserve" element={<ReserveList />} />
      <Route path="/myrental" element={<RentalList />} />
    </Routes>
  );
};

export default App;
