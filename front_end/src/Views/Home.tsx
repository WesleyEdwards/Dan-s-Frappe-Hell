import { Button, Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { DFHeader } from "../components/DFHeader";
import { useAuth } from "../utils/AuthContext";

export const Home: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell." />
        <Typography align="center">Frappuccinos to Come</Typography>
        {!user && (
          <Button variant="contained" onClick={navigateToLogin}>
            Sign In
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default Home;
