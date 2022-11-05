import { Container, Stack, Tabs, Tab } from "@mui/material";
import React, { FC, useState } from "react";
import Pickup from "./Pickup";
import CashierCreateOrder from "./CashierCreateOrder";

export const CashierView: FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = () => {
    setTabValue(tabValue === 0 ? 1 : 0);
  };

  return (
    <Stack direction="row">
      <Tabs
        orientation="vertical"
        value={tabValue}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider", minWidth: "14rem" }}
      >
        <Tab label="Pick-up" />
        <Tab label="Place Order" />
      </Tabs>
      <Container maxWidth="lg">
        <Stack direction="row">
          {tabValue === 0 ? <Pickup /> : <CashierCreateOrder />}
        </Stack>
      </Container>
    </Stack>
  );
};

export default CashierView;