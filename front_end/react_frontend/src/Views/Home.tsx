import { Button, Container, Stack } from "@mui/material";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { DFHeader } from "../components/DFHeader";

export const Home: FC = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="md">
      <Stack padding="8rem" justifyContent="center">
        <DFHeader title="Home" />
        <Button variant="contained" onClick={navigateToLogin}>
          Log-In
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
