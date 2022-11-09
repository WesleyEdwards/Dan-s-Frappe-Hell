import {
  Alert,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { Employee, getMyEmployeeById } from "../api/api-functions";
import { Permission } from "../api/models";
import { isPermissionString } from "../utils/userHelperFunctions";
import { UserRow } from "../Views/admin/CustomerList";
import { DFHDialogActions } from "./DFHDialogActions";
import DialogHeader from "./DialogHeader";
import Loading from "./Loading";
import MoneyField from "./MoneyField";

interface EditEmployeeDialogueProps {
  user: UserRow | undefined;
  handleClose: () => void;
  submitUser: (userId: string, newPerm: Permission, newPayRate: number) => void;
}
export const EditEmployeeDialogue: FC<EditEmployeeDialogueProps> = (props) => {
  const { user, handleClose, submitUser } = props;
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [newPermission, setNewPermission] = useState<Permission>(
    user?.permission ?? "None"
  );
  const [newPayRate, setNewPayRate] = useState<number>(0);

  const handleSubmit = () => {
    if (!user || !newPermission) return;
    submitUser(user.id.toString(), newPermission, newPayRate);
  };

  useEffect(() => {
    if (!user) return;
    getMyEmployeeById(user.id).then((employee) => {
      setNewPayRate(employee.payRate);
      setEmployee(employee);
    });
    setNewPermission(user.permission);
  }, [user]);

  if (!newPermission || !user) return <></>;
  if (!employee) return <Loading />;

  return (
    <Dialog open={user !== undefined} onClose={handleClose} fullWidth={true}>
      <DialogContent>
        <Stack gap="2rem">
          <DialogHeader title={user.name} />
          <FormControl>
            <InputLabel style={{ paddingBottom: 20 }}>Status</InputLabel>
            <Select
              value={newPermission}
              label={"Status"}
              onChange={(e) => {
                setNewPermission(
                  isPermissionString(e.target.value) ? e.target.value : "None"
                );
              }}
            >
              <MenuItem key={"None"} value={"None"}>
                None
              </MenuItem>
              <MenuItem key={"Customer"} value={"Customer"}>
                Customer
              </MenuItem>
              <MenuItem key={"Employee"} value={"Employee"}>
                Employee
              </MenuItem>
              <MenuItem key={"Manager"} value={"Manager"}>
                Manager
              </MenuItem>
              <MenuItem key={"Admin"} value={"Admin"}>
                Admin
              </MenuItem>
            </Select>
          </FormControl>

          <Divider />

          <MoneyField
            title={"Pay Rate"}
            value={newPayRate}
            onChange={setNewPayRate}
            float
          />

          {newPayRate < 15 && (
            <Alert severity="info">
              You cannot pay any employee less than 15 $/hr. This store is too
              boujee for that.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DFHDialogActions
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        disableSubmit={
          user.permission === newPermission && newPayRate === employee.payRate
        }
      />
    </Dialog>
  );
};

export default EditEmployeeDialogue;
