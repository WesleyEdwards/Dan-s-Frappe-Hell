import { Container, Stack } from "@mui/material";
import React, { FC, useState } from "react";
import {
  modifyUserPermission,
  setEmployeePayRate,
} from "../../api/api-functions";
import { Permission } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import EditEmployeeDialogue from "../../components/EditEmployeeDialogue";
import CustomerList, { UserRow } from "./CustomerList";

export const EmployeeManagement: FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserRow | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleClose = () => {
    setSelectedUser(undefined);
  };

  const editEmployee = (
    userId: string,
    newPerm?: Permission,
    newPayRate?: number
  ) => {
    const promises: Promise<unknown>[] = [];
    if (newPerm) {
      promises.push(modifyUserPermission(userId, newPerm));
    }
    if (newPayRate) {
      promises.push(setEmployeePayRate(userId, newPayRate));
    }

    Promise.all(promises).then(() => {
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
            permissionLevels={["Manager", "Employee"]}
          />
        </Stack>
      </Container>
      <EditEmployeeDialogue
        user={selectedUser}
        handleClose={handleClose}
        submitUser={editEmployee}
      />
    </>
  );
};

export default EmployeeManagement;
