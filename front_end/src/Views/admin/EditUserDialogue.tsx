import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { Permission } from "../../api/models";
import {
  getPermissionString,
  isPermissionString,
} from "../../utils/helperFunctions";
import { UserRow } from "./CustomerList";

interface EditUserDialogueProps {
  user: UserRow | undefined;
  handleClose: () => void;
  submitUser: (userId: string, newPerm: Permission) => void;
}
export const EditUserDialogue: FC<EditUserDialogueProps> = (props) => {
  const { user, handleClose, submitUser } = props;
  const [newPermission, setNewPermission] = useState<Permission>();

  const handleSubmit = () => {
    if (!user || !newPermission) return;
    submitUser(user.id.toString(), newPermission);
  };

  useEffect(() => {
    setNewPermission(getPermissionString(user?.permission));
  }, [user]);

  if (!newPermission || !user) return <></>;

  return (
    <Dialog open={user !== undefined} onClose={handleClose} fullWidth={true}>
      <DialogContent>
        <Stack gap="2rem">
          <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
            {user.name}
          </DialogContentText>

          <FormControl>
            <InputLabel style={{ paddingBottom: 20 }}>Permission</InputLabel>
            <Select
              value={newPermission}
              label={"Permission"}
              onChange={(e) => {
                setNewPermission(
                  isPermissionString(e.target.value) ? e.target.value : "None"
                );
              }}
            >
              <MenuItem key={"0"} value={"None"}>
                None
              </MenuItem>
              <MenuItem key={"1"} value={"Customer"}>
                Customer
              </MenuItem>
              <MenuItem key={"2"} value={"Employee"}>
                Employee
              </MenuItem>
              <MenuItem key={"3"} value={"Manager"}>
                Manager
              </MenuItem>
              <MenuItem key={"4"} value={"Admin"}>
                Admin
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={getPermissionString(user.permission) === newPermission}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialogue;
