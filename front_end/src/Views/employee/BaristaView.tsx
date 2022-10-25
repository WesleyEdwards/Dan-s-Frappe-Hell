import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../../components/DFHeader";

export const BaristaView: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Barista View" />
        <Typography align="center">Only employees can see this page</Typography>
      </Stack>
    </Container>
  );
};

export default BaristaView;
