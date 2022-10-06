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
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell." />
        <Stack direction="row" justifyContent="center">
          <Button variant="contained" onClick={navigateToLogin}>
            Log-In
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
