import { Container, Stack } from "@mui/material";
import React, { FC, useState } from "react";
import { modifyUserPermission } from "../../api/api-functions";
import { Permission } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import CustomerList, { UserRow } from "./CustomerList";
import EditUserDialogue from "./EditUserDialogue";

export const EmployeeManagement: FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserRow | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleClose = () => {
    setSelectedUser(undefined);
  };

  const changePermissionLevel = (userId: string, newPerm: Permission) => {
    modifyUserPermission(userId, newPerm).then(() => {
      setRefreshTrigger(!refreshTrigger);
      handleClose();
    });
  };

  return (
    <>
      <Container maxWidth="md">
        <Stack gap="8rem" justifyContent="center">
          <DFHeader title="Employee Management" />
          <CustomerList
            refreshTrigger={refreshTrigger}
            setSelectedUser={setSelectedUser}
            permissionLevels={["2", "3"]}
          />
        </Stack>
      </Container>
      <EditUserDialogue
        user={selectedUser}
        handleClose={handleClose}
        submitUser={changePermissionLevel}
      />
    </>
  );
};

export default EmployeeManagement;
