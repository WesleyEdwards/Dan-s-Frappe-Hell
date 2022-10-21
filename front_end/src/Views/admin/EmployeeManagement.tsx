import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../../components/DFHeader";

export const EmployeeManagement: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Employee Management" />
        <Typography align="center">Employees of DFH</Typography>
      </Stack>
    </Container>
  );
};

export default EmployeeManagement;
