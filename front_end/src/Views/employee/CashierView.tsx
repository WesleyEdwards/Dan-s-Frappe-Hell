import { DFHeader } from "../../components/DFHeader";
import { Loading } from "../../components/Loading";
import {
  Button,
  Container,
  Grid,
  Stack,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
  getAllMenuItems,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import { MenuItem, Order } from "../../api/models";
import { useAuth } from "../../utils/AuthContext";

export const CashierView: FC = () => {
  const { refreshUser } = useAuth();
  const [menuitems, setMenuItems] = useState<MenuItem[]>();
  const [finishedOrders, setFinishedOrders] = useState<Order[]>();

  const [tabValue, setTabValue] = useState(0);

  const handleChange = () => {
    setTabValue(tabValue === 0 ? 1 : 0);
  };

  useEffect(() => {
    getAllMenuItems().then(setMenuItems);
    getOrdersByStatus("FINISHED").then((red) => {
      setFinishedOrders(red);
    });
  }, []);

  if (!menuitems) return <Loading />;

  const completeOrder = (order: Order) => {
    updateOrder({
      OrderId: order.OrderId,
      Items: order.Items,
      Favorite: order.Favorite,
      Status: "FULFILLED",
    })
      .then((res) => {
        getOrdersByStatus("FINISHED").then((red) => {
          setFinishedOrders(red);
        });
      })
      .then(refreshUser);
  };

  if (!finishedOrders || !menuitems) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Stack direction="row">
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Pick-up" />
          <Tab label="Place Order" />
        </Tabs>

        {tabValue === 0 ? <Pickup /> : <Typography>Other</Typography>}
      </Stack>
    </Container>
  );
};

export default CashierView;
