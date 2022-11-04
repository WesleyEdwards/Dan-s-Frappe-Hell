import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getAllMenuItems } from "../../api/api-functions";
import { DisplayOrder, Order, OrderItem } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import Loading from "../../components/Loading";
import { OrderDrinkGrid } from "../../components/OrderDrinkGrid";
import {
  createDisplayOrderFromOrder,
  roundToTwoDecimals,
} from "../../utils/helperFunctions";

export const CashierCreateOrder: FC = () => {
  const [displayCart, setDisplayCart] = useState<DisplayOrder>();

  const [order, setOrder] = useState<Order>({
    OrderId: -1,
    UserId: -1,
    Favorite: false,
    Items: [],
    OrderDate: -1,
    Status: "CART",
    TotalPrice: -1,
  });

  const fetchStuff = async () => {
    const menuItems = await getAllMenuItems();
    const displayOrder = createDisplayOrderFromOrder(order, menuItems);
    setDisplayCart(displayOrder);
  };

  const calculatePrice = (orderItem: OrderItem) => {
    let totalPrice = 0;
    order.Items.forEach((item) => {
      totalPrice += item.price;
    });
    return roundToTwoDecimals(totalPrice + orderItem.price);
  };

  useEffect(() => {
    fetchStuff();
  }, [order]);

  if (!displayCart) return <Loading />;
  return (
    <>
      <Stack gap="2rem" justifyContent="center" padding="4rem">
        <DFHeader title="Place Order" />
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {displayCart.orderItems.length > 0 ? (
            <List>
              {displayCart.orderItems.map((item, i) => {
                return (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`${item.quantity} - ${item.drinkName} - $${item.price}`}
                    />
                  </ListItem>
                );
              })}
              <Divider sx={{ my: "1rem" }} />
              <ListItem>
                <ListItemText primary={`Total: $${order.TotalPrice}`} />
              </ListItem>
            </List>
          ) : (
            <Typography>Cart is empty</Typography>
          )}

          <Button
            variant="contained"
            onClick={() => {
              console.log("Order Placed");
            }}
          >
            Checkout
          </Button>
        </Stack>
        <Divider />
        <OrderDrinkGrid
          handleAddToCart={(orderItem: OrderItem) => {
            const newOrders = [...order.Items, orderItem];
            const newPrice = calculatePrice(orderItem);
            setOrder({
              ...order,
              Items: newOrders,
              TotalPrice: newPrice,
            });
            return Promise.resolve();
          }}
        />
      </Stack>
    </>
  );
};

export default CashierCreateOrder;
