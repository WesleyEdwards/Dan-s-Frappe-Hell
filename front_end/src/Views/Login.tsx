import { Container, Card, CardContent } from "@mui/material";
import React, { FC, useState } from "react";
import CreateAccount from "../components/auth/CreateAccoun";
import { ForgotPassword } from "../components/auth/ForgotPassword";
import LoginForm from "../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<
    "Login" | "CreateAccount" | "ForgotPassword"
  >("Login");

  const navigateToHome = () => {
    navigate("/home");
  };
  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 24 }}>
        <CardContent>
          <>
            {(() => {
              if (loginForm === "Login") {
                return (
                  <LoginForm
                    switchToCreateAccount={() => setLoginForm("CreateAccount")}
                    switchToForgotPassword={() =>
                      setLoginForm("ForgotPassword")
                    }
                    navigateToHome={navigateToHome}
                  />
                );
              }
              if (loginForm === "CreateAccount") {
                return (
                  <CreateAccount
                    switchToLogin={() => setLoginForm("Login")}
                    navigateToHome={navigateToHome}
                  />
                );
              }
              if (loginForm === "ForgotPassword") {
                return (
                  <ForgotPassword switchToLogin={() => setLoginForm("Login")} />
                );
              }
            })()}
          </>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
