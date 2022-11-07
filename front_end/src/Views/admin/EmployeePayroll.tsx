import {Alert, Button, Container, Dialog, DialogActions, DialogTitle, Stack} from "@mui/material";
import React, {FC, useState} from "react";
import { DFHeader } from "../../components/DFHeader";

import StoreFunds from "../../components/StoreFunds";
import PayrollList from "./PayrollList";
import {payAllEmployees} from "../../api/api-functions";
export const EmployeePayroll: FC = () => {

    const [open, setOpen] = useState(false);
    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [error, setError] = useState<string | undefined>();

    const payEmployees = () => {
        payAllEmployees()
            .then(() => {
                handleClose();
            })
            .catch((err) => {
                setError(err);
            });
    }

    return (
        <>
            <Container maxWidth="md">
                <Stack gap="8rem" justifyContent="center">
                    <Stack gap="2rem" justifyContent="center">
                        <DFHeader title="Employee Management" />
                        <StoreFunds/>
                    </Stack>
                    <Stack gap="2rem" justifyContent="center">
                        <Stack direction="row" gap="2rem" justifyContent="center">
                        <Button onClick={handleClick} variant="contained">
                            Pay All Employees
                        </Button>
                        </Stack>
                        <PayrollList/>
                    </Stack>
                </Stack>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ p: "4rem" }}>Confirm Employee Payment</DialogTitle>
                {error && <Alert severity="error">{error}</Alert>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() =>
                            payEmployees()
                        }
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmployeePayroll;
