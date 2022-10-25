import { Container, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getAllUsers } from "../../api/api-functions";
import { User } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";

export const CustomerManagement: FC = () => {
  const [users, setUsers] = useState<User[] | undefined>([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Customer Management" />
        <Typography align="center">Customers of DFH</Typography>
        {users?.map((user) => (
          <Typography key={user.userId}>{user.firstName}</Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default CustomerManagement;
