import { Container, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { getCartOrder, updateOrder } from "../api/api-functions";
import { Order, OrderItem } from "../api/models";
import { useAuth } from "../utils/AuthContext";
import { OrderDrinkGrid } from "../components/OrderDrinkGrid";
import HomeCarousel from "../components/HomeCarousel";

export const Home: FC = () => {
  const { user, refreshUser } = useAuth();
  const [cartOrder, setCartOrder] = useState<Order>();

  const fetchCartOrder = () => {
    if (!user) return;
    setCartOrder(undefined);
    getCartOrder(user.userId).then(setCartOrder);
  };

  const handleAddToCart = (menuItem: OrderItem) => {
    if (!cartOrder) return Promise.resolve();
    const newList: OrderItem[] = cartOrder.Items;
    newList.push(menuItem);
    return updateOrder({
      OrderId: cartOrder.OrderId,
      Items: newList,
      Favorite: cartOrder.Favorite,
      Status: "CART",
    }).then(refreshUser);
  };

  useEffect(() => {
    fetchCartOrder();
  }, [user]);

  return (
    <>
      <Typography padding="4rem" variant="h2" align="center">
        Welcome to Dan's Frappuccino Hell
      </Typography>
      <Container maxWidth="md">
        <Stack gap="2rem" justifyContent="center" alignItems="center">
          <HomeCarousel />
          <OrderDrinkGrid handleAddToCart={handleAddToCart} />
        </Stack>
      </Container>
    </>
  );
};

export default Home;
