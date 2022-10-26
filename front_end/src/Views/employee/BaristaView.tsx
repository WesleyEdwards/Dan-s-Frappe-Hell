import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../../components/DFHeader";
import { MenuItem, Order } from "../../api/models";
import { Loading } from "../../components/Loading";
import {
  getMenuItems,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import BaristaCard from "../../components/BaristaCard";

export const BaristaView: FC = () => {
  const [menuitems, setMenuItems] = useState<MenuItem[]>([]);
  const [placedOrders, setPlacedOrders] = useState<Order[]>([]);
  useEffect(() => {
    getMenuItems().then((res) => {
      setMenuItems(res);
      getOrdersByStatus("PLACED").then((red) => {
        setPlacedOrders(red);
      });
    });
  }, []);

  if (menuitems.length === 0) return <Loading />;

  const completeOrder = (order: Order) => {
    updateOrder(order.OrderId, order.Items, order.Favorite, "FINISHED").then(
      (res) => {
        getOrdersByStatus("PLACED").then((red) => {
          setPlacedOrders(red);
        });
      }
    );
  };

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell" />
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {placedOrders.map((o) => {
            return (
              <Grid item md={6}>
                <BaristaCard order={o} completeOrder={completeOrder} />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
};

export default BaristaView;
