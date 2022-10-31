import { Button, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
  getAllMenuItems,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import { Order, MenuItem } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import Loading from "../../components/Loading";
import { useAuth } from "../../utils/AuthContext";

export const Pickup: FC = () => {
  const { refreshUser } = useAuth();
  const [menuitems, setMenuItems] = useState<MenuItem[]>();
  const [finishedOrders, setFinishedOrders] = useState<Order[]>();

  useEffect(() => {
    getAllMenuItems().then(setMenuItems);
    getOrdersByStatus("FINISHED").then((red) => {
      setFinishedOrders(red);
    });
  }, []);

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

  if (!menuitems) return <Loading />;

  if (!finishedOrders || !menuitems) return <Loading />;

  return (
    <div>
      <DFHeader title="Customer Pickup" />
      <Stack gap="2rem" justifyContent="center" padding="4rem">
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
    </div>
  );
};

export default Pickup;
