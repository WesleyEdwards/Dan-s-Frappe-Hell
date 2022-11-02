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
import { isPermissionString } from "../../utils/userHelperFunctions";
import { UserRow } from "./CustomerList";

interface EditUserDialogueProps {
  user: UserRow | undefined;
  handleClose: () => void;
  submitUser: (userId: string, newPerm: Permission) => void;
}
export const EditUserDialogue: FC<EditUserDialogueProps> = (props) => {
  const { user, handleClose, submitUser } = props;
  const [newPermission, setNewPermission] = useState<Permission>(
    user?.permission ?? "None"
  );

  const handleSubmit = () => {
    if (!user || !newPermission) return;
    submitUser(user.id.toString(), newPermission);
  };

  useEffect(() => {
    if (!user) return;
    setNewPermission(user.permission);
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={user.permission === newPermission}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialogue;
