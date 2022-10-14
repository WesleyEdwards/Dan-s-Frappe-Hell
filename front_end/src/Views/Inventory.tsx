import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../components/DFHeader";

export const Inventory: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Inventory" />
        <Typography align="center">This can only be seen by Admins</Typography>
      </Stack>
    </Container>
  );
};

export default Inventory;
