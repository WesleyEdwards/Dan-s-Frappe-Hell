import { Container, Stack } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../../components/DFHeader";

export const EmployeePayroll: FC = () => {

    return (
        <Container maxWidth="md">
            <Stack gap="2rem" justifyContent="center">
                <DFHeader title="Employee Payroll" />
            </Stack>
        </Container>
    );
};

export default EmployeePayroll;
