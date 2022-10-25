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
import React, { FC, useState } from "react";
import { Permission } from "../../api/models";
import { UserRow } from "./CustomerList";

interface EditUserDialogueProps {
  user: UserRow | undefined;
  handleClose: () => void;
  submitUser: (userId: string, newPerm: string) => void;
}
export const EditUserDialogue: FC<EditUserDialogueProps> = (props) => {
  const { user, handleClose, submitUser } = props;
  const [newPermission, setNewPermission] = useState<string | undefined>(
    user?.status
  );

  const handleSubmit = () => {
    if (!user || !newPermission) return;
    submitUser(user.id.toString(), newPermission);
  };

  if (!user) return <></>;
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
              label={"Kind"}
              onChange={(e) => {
                setNewPermission(e.target.value as string);
              }}
            >
              {Object.values(Permission).map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialogue;
