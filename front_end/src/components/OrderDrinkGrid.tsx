import { Grid, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DrinkCard } from "../components/Drink/DrinkCard";
import { Drink, OrderItem } from "../api/models";
import { getActiveMenuItems, getIngredients } from "../api/api-functions";
import { mapMenuItemsToIngredients } from "../utils/helperFunctions";
import Loading from "./Loading";

interface OrderDrinkGridProps {
  handleAddToCart: (orderItem: OrderItem) => Promise<void>;
}

export const OrderDrinkGrid: FC<OrderDrinkGridProps> = (props) => {
  const { handleAddToCart } = props;

  const [drinks, setDrinks] = useState<Drink[]>();

  const fetchDrinks = async () => {
    setDrinks(undefined);
    const menuItems = await getActiveMenuItems();
    const ingredients = await getIngredients();
    const newDrinks = mapMenuItemsToIngredients(menuItems, ingredients);
    setDrinks(newDrinks);
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  if (!drinks) return <Loading />;

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {drinks.map((drink, i) => {
        return (
          <Grid item xs={4} sm={4} md={4} key={i}>
            <DrinkCard drink={drink} handleAddToCart={handleAddToCart} />
          </Grid>
        );
      })}
    </Grid>
  );
};
