import { Container, Stack } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../../components/DFHeader";
import CustomerList from "./CustomerList";

export const CustomerManagement: FC = () => {
  return (
    <Container maxWidth="md">
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Customer Management" />
        <CustomerList
          refreshTrigger={false}
          setSelectedUser={() => {
            console.log("setSelectedUser");
          }}
        />
      </Stack>
    </Container>
  );
};

export default CustomerManagement;
