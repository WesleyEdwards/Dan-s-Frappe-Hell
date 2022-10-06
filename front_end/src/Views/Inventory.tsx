import { Container, Stack } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../components/DFHeader";

export const Inventory: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Inventory Landing Page" />
      </Stack>
    </Container>
  );
};

export default Inventory;
