import { Button } from "@mui/material";
import React, { FC } from "react";

export const CashierCreateOrder: FC = () => {
  return (
    <>
      <Button variant="contained" sx={{ alignSelf: "flex-end" }}>
        New Order
      </Button>
    </>
  );
};

export default CashierCreateOrder;
