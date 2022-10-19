import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../../components/DFHeader";

export const CashierView: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Cashier View" />
        <Typography align="center">Only employees can see this page</Typography>
      </Stack>
    </Container>
  );
};

export default CashierView;
