import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../components/DFHeader";

export const Home: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell." />
        <Typography align="center">Frappuccinos to Come</Typography>
      </Stack>
    </Container>
  );
};

export default Home;
