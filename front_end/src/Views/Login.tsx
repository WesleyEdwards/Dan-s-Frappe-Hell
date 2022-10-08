import { Container, Card, CardContent } from "@mui/material";
import React, { FC, useState } from "react";
import { CreateAccountForm } from "../components/CreateAccounForm";
import LoginForm from "../components/LoginForm";

export const Login: FC = () => {
  const [loginForm, setLoginForm] = useState(true);
  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 24 }}>
        <CardContent>
          {loginForm ? (
            <LoginForm switchToCreateAccount={() => setLoginForm(false)} />
          ) : (
            <CreateAccountForm switchToLogin={() => setLoginForm(true)} />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
