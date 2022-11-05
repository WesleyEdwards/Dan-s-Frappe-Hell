import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { Employee, getMyEmployee, setHoursWorked } from "./api/api-functions";
import DialogHeader from "./components/DialogHeader";
import Loading from "./components/Loading";
import { useAuth } from "./utils/AuthContext";
import { roundToTwoDecimals } from "./utils/helperFunctions";

export const EmployeeInfo: FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const [addHours, setAddHours] = useState<number>(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddHours(0);
  };

  const fetchEmployee = () => {
    setEmployee(undefined);
    if (!user) return;
    getMyEmployee().then(setEmployee);
  };

  const changeHours = () => {
    if (!user || !employee) return;
    setHoursWorked(addHours).then(() => {
      fetchEmployee();
      handleClose();
    });
  };

  useEffect(() => {
    fetchEmployee();
  }, [user]);

  if (!user || !employee) return <Loading />;

  return (
    <>
      <Stack direction="row" gap="2rem" alignItems="center">
        <Typography>Hours Worked: {employee.hoursWorked} hrs</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Hours
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Stack gap="2rem">
            <DialogHeader title={"Add Hours"} />
            <Stack
              direction="row"
              justifyContent="flex-start"
              gap="4rem"
              alignItems="center"
            >
              <Typography>Add Hours:</Typography>
              <TextField
                type={"number"}
                label={"Hours"}
                value={addHours}
                onChange={(e) =>
                  setAddHours(roundToTwoDecimals(parseFloat(e.target.value)))
                }
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={false} onClick={changeHours}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeInfo;
