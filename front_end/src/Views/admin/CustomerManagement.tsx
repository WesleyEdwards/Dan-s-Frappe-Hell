import { Container } from "@mui/material";
import React, { FC, useState } from "react";
import { modifyUserPermission } from "../../api/api-functions";
import { Permission } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import CustomerList, { UserRow } from "./CustomerList";
import EditUserDialogue from "./EditUserDialogue";

export const CustomerManagement: FC = () => {
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
        <DFHeader title="Customer Management" paddingBottom />
        <CustomerList
          refreshTrigger={refreshTrigger}
          setSelectedUser={setSelectedUser}
          permissionLevels={["None", "Customer"]}
        />
      </Container>
      <EditUserDialogue
        user={selectedUser}
        handleClose={handleClose}
        submitUser={changePermissionLevel}
      />
    </>
  );
};

export default CustomerManagement;
