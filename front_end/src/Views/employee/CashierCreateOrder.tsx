import { Button, Stack } from "@mui/material";
import React, { FC } from "react";
import { DFHeader } from "../../components/DFHeader";

export const CashierCreateOrder: FC = () => {
  return (
    <div>
      <DFHeader title="Customer Pickup" />
      <Stack gap="2rem" justifyContent="center" padding="4rem">
        <Button variant="contained" sx={{ alignSelf: "flex-end" }}>
          New Order
        </Button>
      </Stack>
    </div>
  );
};

export default CashierCreateOrder;
