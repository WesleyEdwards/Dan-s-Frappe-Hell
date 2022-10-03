import { Button, Container, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DFHeader } from "../components/DFHeader";

export const Login = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/home");
  };

  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Sign In" />
        <Button variant="contained" onClick={navigateToHome}>
          Home
        </Button>
      </Stack>
    </Container>
  );
};

export default Login;
