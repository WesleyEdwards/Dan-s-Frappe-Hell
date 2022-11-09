import { Grid, Stack, Container, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
  getAllMenuItems,
  getAllUsers,
  getOrdersByStatus,
  updateOrder,
} from "../../api/api-functions";
import { Order, MenuItem, DisplayOrder, User } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import { createDisplayOrders } from "../../utils/helperFunctions";
import PickupCard from "../../components/PickupCard";
import Loading from "../../components/Loading";

export interface DisplayPickup {
  displayOrder: DisplayOrder;
  user: User | undefined;
}

export const Pickup: FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [finishedOrders, setFinishedOrders] = useState<
    Order[] | undefined | null
  >();
  const [displayPickup, setDisplayPickup] = useState<
    DisplayPickup[] | undefined
  >();

  const fetchPlacedOrders = async () => {
    setDisplayPickup(undefined);
    setFinishedOrders(undefined);
    const orders: Order[] = await getOrdersByStatus("FINISHED");
    const menuItems: MenuItem[] = await getAllMenuItems();
    const users = await getAllUsers();
    const displayOrders = createDisplayOrders(orders, menuItems);
    const displayPickup: DisplayPickup[] = displayOrders.map((displayOrder) => {
      const user = users.find(
        (user) => parseInt(user.userId) === displayOrder.userId
      );
      return { displayOrder, user };
    });

    setDisplayPickup(displayPickup);
    setFinishedOrders(orders);
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

  if (!displayPickup) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Customer Pick-up" />
        {displayPickup.length > 0 ? (
          <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
            {displayPickup.map((pickup) => {
              return (
                <Grid item md={6}>
                  <PickupCard
                    displayPickup={pickup}
                    completeOrder={completeOrder}
                  />
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
