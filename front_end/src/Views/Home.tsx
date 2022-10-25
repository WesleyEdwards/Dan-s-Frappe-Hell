import { Container, Grid, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";
import { Loading } from "../components/Loading";
import {
  getCartOrder,
  getIngredients,
  getMenuItems,
  updateOrder,
} from "../api/api-functions";
import { mapMenuItemsToIngredients } from "../utils/helperFunctions";
import { Drink, Order, OrderItem } from "../api/models";
import { useAuth } from "../utils/AuthContext";

export const Home: FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>();
  const { user } = useAuth();
  const [cartOrder, setCartOrder] = useState<Order>();

  const fetchDrinks = async () => {
    setDrinks(undefined);
    const menuItems = await getMenuItems();
    const ingredients = await getIngredients();
    const newDrinks = mapMenuItemsToIngredients(menuItems, ingredients);
    setDrinks(newDrinks);
  };
  const fetchCartOrder = () => {
    if (!user || !cartOrder) return;
    setCartOrder(undefined);
    getCartOrder(user.userId).then(setCartOrder);
  };

  const handleAddToCart = (drink: Drink) => {
    if (!cartOrder) return;
    const newList: OrderItem[] = [];
    console.log(cartOrder.Items);
    cartOrder.Items.forEach((i) => {
      return newList.push(i);
    });
    newList.push({ menuId: drink.menuItem.MenuId, quantity: 1, price: 0 });
    return updateOrder(cartOrder.OrderId, newList, false, "CART");
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
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {drinks.map((drink) => {
            return (
              <Grid item md={6}>
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
