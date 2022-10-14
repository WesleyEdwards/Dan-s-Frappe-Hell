import { Button, Container, Stack, TextField } from "@mui/material";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { DFHeader } from "../components/DFHeader";
import { useAuth } from "../utils/AuthContext";

export const Profile: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  if (!user) {
    return <div>Not logged in.</div>;
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
        <Stack direction="row" gap="2rem" justifyContent="flex-end">
          <Button variant="contained" onClick={handleLogout}>
            Sign Out
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
export default Profile;
