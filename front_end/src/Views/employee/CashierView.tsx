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
    <Container maxWidth="lg">
      <Stack direction="row" sx={{ height: "60rem" }}>
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Pick-up" />
          <Tab label="Place Order" />
        </Tabs>

        {tabValue === 0 ? <Pickup /> : <CashierCreateOrder />}
      </Stack>
    </Container>
  );
};

export default CashierView;
