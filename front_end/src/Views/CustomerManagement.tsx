import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../components/DFHeader";

export const CustomerManagement: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Customer Management" />
        <Typography align="center">Customers of DFH</Typography>
      </Stack>
    </Container>
  );
};

export default CustomerManagement;
