import { Button, Container, Divider, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import AccountFunds from "../components/AccountFunds";
import { DFHeader } from "../components/DFHeader";
import Loading from "../components/Loading";
import EmployeeInfo from "../EmployeeInfo";
import { useAuth } from "../utils/AuthContext";
import { hasPermission } from "../utils/userHelperFunctions";

export const Profile: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  if (!user) return <Loading />;

  return (
    <Container maxWidth="md">
      <DFHeader title={`${user.firstName} ${user.lastName}`} />
      <Stack direction="column" gap="2rem">
        <Typography>{`${user.email}`}</Typography>
        <Divider />

        <AccountFunds />
        {hasPermission(user, "Employee") && (
          <>
            <Divider />
            <EmployeeInfo />
          </>
        )}

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
