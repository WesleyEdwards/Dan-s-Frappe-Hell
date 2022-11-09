import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../../components/DFHeader";
import StoreFunds from "../../components/StoreFunds";
import PayrollList from "./PayrollList";
import { DFHDialogActions } from "../../components/DFHDialogActions";
import DialogHeader from "../../components/DialogHeader";
import { getPayrollTotal, payAllEmployees } from "../../api/api-functions";

export const EmployeePayroll: FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const handleClick = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const payEmployees = () => {
    payAllEmployees().then((res) => {
      if (res.error === null) {
        setRefreshTrigger(!refreshTrigger);
        handleClose();
      } else {
        setError(res.error);
      }
    });
  };

  useEffect(() => {
    getPayrollTotal().then((res) => {
      setTotalCost(res.total);
    });
  }, [refreshTrigger]);

  return (
    <>
      <Container maxWidth="md">
        <DFHeader title="Employee Management" paddingBottom />
        <StoreFunds refreshTrigger={refreshTrigger} />
        <Stack gap="2rem" justifyContent="center">
          <Stack direction="row" gap="2rem" justifyContent="center">
            <Button onClick={handleClick} variant="contained">
              Pay All Employees
            </Button>
          </Stack>
          <PayrollList refreshTrigger={refreshTrigger} />
        </Stack>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogHeader title="Confirm Employee Payment" />
          {error ? (
            <Alert severity="error" sx={{ my: "2rem" }}>
              The store does not have enough funds to pay all employees
            </Alert>
          ) : (
            <Alert severity="info" sx={{ my: "2rem" }}>
              This will deduct ${totalCost} from the store balance
            </Alert>
          )}
        </DialogContent>
        <DFHDialogActions
          handleClose={handleClose}
          handleSubmit={payEmployees}
          submitText="Confirm"
        />
      </Dialog>
    </>
  );
};

export default EmployeePayroll;
