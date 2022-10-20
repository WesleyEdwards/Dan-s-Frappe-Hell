import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import DFRoutes from "./components/auth/DFRoutes";
import { AuthProvider } from "./utils/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppHeader />
        <DFRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
