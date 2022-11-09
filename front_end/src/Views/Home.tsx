import { Container, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
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

  function LogoImage() {
    return (
      <img
        src="https://media.discordapp.net/attachments/1017128616074674198/1028080577963905066/logo-color.png"
        alt="logo"
        width="100"
        height="100"
      />
    );
  }

  return (
    <>
      <Stack
        direction="row"
        padding="3rem"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
      >
        <LogoImage />
        <Typography variant="h2" align="center">
          Welcome to Dan's Frappuccino Hell
        </Typography>
        <LogoImage />
      </Stack>
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
