import { Container, Grid, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/Drink/DrinkCard";
import { Loading } from "../components/Loading";
import {
  getCartOrder,
  getIngredients,
  getActiveMenuItems,
  updateOrder,
} from "../api/api-functions";
import { mapMenuItemsToIngredients } from "../utils/helperFunctions";
import { Drink, Order, OrderItem } from "../api/models";
import { useAuth } from "../utils/AuthContext";
import HomeCarousel from "../components/HomeCarousel";

export const Home: FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>();
  const { user, refreshUser } = useAuth();
  const [cartOrder, setCartOrder] = useState<Order>();

  const fetchDrinks = async () => {
    setDrinks(undefined);
    const menuItems = await getActiveMenuItems();
    const ingredients = await getIngredients();
    const newDrinks = mapMenuItemsToIngredients(menuItems, ingredients);
    setDrinks(newDrinks);
  };
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
    fetchDrinks();
    fetchCartOrder();
  }, [user]);

  if (drinks === undefined) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell" />
        <HomeCarousel></HomeCarousel>
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {drinks.map((drink, i) => {
            return (
              <Grid item key={i} md={6}>
                <DrinkCard drink={drink} handleAddToCart={handleAddToCart} />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
};

export default Home;
