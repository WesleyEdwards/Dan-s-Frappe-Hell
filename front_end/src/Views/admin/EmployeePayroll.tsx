import {
    Alert,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography
} from "@mui/material";
import React, {FC, useEffect, useState} from "react";
import { DFHeader } from "../../components/DFHeader";

import StoreFunds from "../../components/StoreFunds";
import PayrollList from "./PayrollList";
import {getPayrollTotal, payAllEmployees} from "../../api/api-functions";
export const EmployeePayroll: FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const handleClick = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError(null);
    }


    const payEmployees = () => {
        payAllEmployees().then((res)=>{
            if(res.error === null){
                setRefreshTrigger(!refreshTrigger);
                handleClose();
            }else{
                setError(res.error);
            }
        })
    }

    useEffect(() => {
        getPayrollTotal().then((res)=>{
            setTotalCost(res.total);
        })
    }, [refreshTrigger])


    return (
        <>
            <Container maxWidth="md">
                <Stack gap="8rem" justifyContent="center">
                    <Stack gap="2rem" justifyContent="center">
                        <DFHeader title="Employee Management" />
                        <StoreFunds refreshTrigger={refreshTrigger}/>
                    </Stack>
                    <Stack gap="2rem" justifyContent="center">
                        <Stack direction="row" gap="2rem" justifyContent="center">
                        <Button onClick={handleClick} variant="contained">
                            Pay All Employees
                        </Button>
                        </Stack>
                        <PayrollList refreshTrigger={refreshTrigger}/>
                    </Stack>
                </Stack>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ p: "4rem" }}>Confirm Employee Payment</DialogTitle>
                <DialogContent>
                    {error === null &&
                        <Alert severity="info">
                            This will deduct ${totalCost} from the store balance
                        </Alert>
                    }
                    {error!== null &&
                        <Alert severity="error">
                            The store does not have enough funds to pay all employees
                        </Alert>
                    }
                </DialogContent>
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
