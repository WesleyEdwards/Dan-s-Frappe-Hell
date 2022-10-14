import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import { Permission } from "./sdk";
import { AuthProvider } from "./utils/AuthContext";
import { PrivateRoute } from "./utils/PrivateRoute";
import Home from "./Views/Home";
import Inventory from "./Views/Inventory";
import Login from "./Views/Login";
import Profile from "./Views/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppHeader />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/inventory"
            element={
              <PrivateRoute
                path="/"
                permissionRequired={Permission.ADMIN}
                element={<Inventory />}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                path="/"
                permissionRequired={Permission.CUSTOMER}
                element={<Profile />}
              />
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
