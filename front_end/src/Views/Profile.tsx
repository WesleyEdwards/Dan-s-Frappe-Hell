import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  TextField, Typography
} from "@mui/material";
import React, {FC, useState} from "react";
import { useNavigate } from "react-router-dom";
import { DFHeader } from "../components/DFHeader";
import { useAuth } from "../utils/AuthContext";


export const Profile: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  if (!user) {
    return <div>Not logged in.</div>;
  }

  const addToBalance = () => {
    handleClose();
  }

  const handleChange = () => {

  }

  return (
    <Container maxWidth="md">
      <DFHeader title="Profile" />
      <Stack direction="column" gap="2rem">
        <TextField
          label="Name"
          value={`${user?.firstName} ${user?.lastName}`}
          inputProps={{ maxLength: 24 }}
          disabled
          sx={{ width: "32ch" }}
          variant="standard"
        />
        <TextField
          label="Email"
          value={user?.email}
          disabled
          sx={{ width: "32ch" }}
          variant="standard"
        />
        <Stack direction="row" gap="2rem" justifyContent="flex-start">
          <Button variant="contained" onClick={handleOpen}>Add Money To Your Balance</Button>
        </Stack>
        <Stack direction="row" gap="2rem" justifyContent="flex-end">
          <Button variant="contained" onClick={handleLogout}>
            Sign Out
          </Button>
        </Stack>
      </Stack>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContentText>Manage Your Account Balance</DialogContentText>
        <DialogContent>
          <Stack>
            <Typography variant={"subtitle2"}>Enter the amount of money you would like to add here</Typography>
            <input type="number" id="balanceInput"></input>
          </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {addToBalance()}}>Add To Balance</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default Profile;
