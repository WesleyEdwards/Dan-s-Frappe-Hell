import { Grid, Stack, Container, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
  getAllMenuItems,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import { Order, MenuItem, DisplayOrder } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import { createDisplayOrders } from "../../utils/helperFunctions";
import PickupCard from "../../components/PickupCard";
import Loading from "../../components/Loading";

export const Pickup: FC = () => {
  const [displayOrders, setDisplayOrders] = useState<
    DisplayOrder[] | undefined | null
  >();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [finishedOrders, setFinishedOrders] = useState<
    Order[] | undefined | null
  >();

  const fetchPlacedOrders = async () => {
    setDisplayOrders(undefined);
    const orders: Order[] = await getOrdersByStatus("FINISHED");
    const menuItems: MenuItem[] = await getAllMenuItems();
    const displayOrders = createDisplayOrders(orders, menuItems);
    setFinishedOrders(orders);
    setDisplayOrders(displayOrders);
  };

  useEffect(() => {
    fetchPlacedOrders();
  }, [refreshTrigger]);

  const completeOrder = (orderId: number) => {
    const updatedOrder: Order | undefined = (() => {
      return finishedOrders?.find((o) => o.OrderId === orderId);
    })();
    if (!updatedOrder) {
      return Promise.reject("Error completing order");
    }
    return updateOrder({
      ...updatedOrder,
      Status: "FULFILLED",
    }).then(() => {
      getOrdersByStatus("FINISHED").then(() =>
        setRefreshTrigger(!refreshTrigger)
      );
    });
  };

  if (!displayOrders) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Customer Pick-up" />
        {displayOrders.length > 0 ? (
          <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
            {displayOrders.map((order) => {
              return (
                <Grid item md={6}>
                  <PickupCard order={order} completeOrder={completeOrder} />
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

export default Pickup;
