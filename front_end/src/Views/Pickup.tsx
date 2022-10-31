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
import CashierCreateOrder from "../../components/CashierCreateOrder";
import { useAuth } from "../../utils/AuthContext";
import { Routes, Route } from "react-router-dom";

export const Pickup = () => {
  return (
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
  );
};

export default Pickup;
