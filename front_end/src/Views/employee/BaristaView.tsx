import { Container, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../../components/DFHeader";
import { DisplayOrder, MenuItem, Order } from "../../api/models";
import {
  getAllMenuItems,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import BaristaCard from "../../components/BaristaCard";
import { createDisplayOrders } from "../../utils/helperFunctions";
import Loading from "../../components/Loading";

export const BaristaView: FC = () => {
  const [displayOrders, setDisplayOrders] = useState<
    DisplayOrder[] | undefined | null
  >();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [placedOrders, setPlacedOrders] = useState<
    Order[] | undefined | null
  >();

  const fetchPlacedOrders = async () => {
    setDisplayOrders(undefined);
    const orders: Order[] = await getOrdersByStatus("PLACED");
    const menuItems: MenuItem[] = await getAllMenuItems();
    const displayOrders = createDisplayOrders(orders, menuItems);
    setPlacedOrders(orders);
    setDisplayOrders(displayOrders);
  };

  useEffect(() => {
    fetchPlacedOrders();
  }, [refreshTrigger]);

  const completeOrder = (orderId: number) => {
    const updatedOrder: Order | undefined = (() => {
      return placedOrders?.find((o) => o.OrderId === orderId);
    })();
    if (!updatedOrder) {
      return Promise.reject("Error completing order");
    }
    return updateOrder({
      ...updatedOrder,
      Status: "FINISHED",
    }).then(() => {
      getOrdersByStatus("PLACED").then(() =>
        setRefreshTrigger(!refreshTrigger)
      );
    });
  };

  if (!displayOrders) return <Loading />;
  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Current Orders" />
        {displayOrders.length > 0 ? (
          <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
            {displayOrders.map((order) => {
              return (
                <Grid item md={6}>
                  <BaristaCard order={order} completeOrder={completeOrder} />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography align="center" paddingTop="2rem">
            There are no orders awaiting Customer Pick-up
          </Typography>
        )}
      </Stack>
    </Container>
  );
};

export default BaristaView;
