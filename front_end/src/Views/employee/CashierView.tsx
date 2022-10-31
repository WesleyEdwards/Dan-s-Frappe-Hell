import { DFHeader } from "../../components/DFHeader";
import { Loading } from "../../components/Loading";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
  getAllMenuItems,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import { MenuItem, Order } from "../../api/models";
import CashierCreateOrder from "../../components/CashierCreateOrder";
import { useAuth } from "../../utils/AuthContext";

export const CashierView: FC = () => {
  const { refreshUser } = useAuth();
  const [menuitems, setMenuItems] = useState<MenuItem[]>();
  const [finishedOrders, setFinishedOrders] = useState<Order[]>();

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
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Cashier Portal" />
        <CashierCreateOrder />
        <Typography variant="h5" gutterBottom>
          Customer Pickup,
        </Typography>
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {finishedOrders.map((order) => {
            return (
              <div key={order.OrderId}>
                <Typography>Order {order.OrderId}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    completeOrder(order);
                  }}
                >
                  Mark as completed
                </Button>
              </div>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
};

export default CashierView;
