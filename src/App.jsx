import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home, About, Login } from "../src/pages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
