import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Home from "./Views/Home";
import Inventory from "./Views/Inventory";
import Login from "./Views/Login";

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
