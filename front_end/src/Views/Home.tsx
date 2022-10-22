import { Container, Grid, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";
import { Loading } from "../components/Loading";
import { getIngredients, getMenuItems, Drink } from "../sdk";
import { mapMenuItemsToIngredients } from "../utils/helperFunctions";

export const Home: FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>();

  const fetchDrinks = async () => {
    setDrinks(undefined);
    const menuItems = await getMenuItems();
    const ingredients = await getIngredients();
    const newDrinks = mapMenuItemsToIngredients(menuItems, ingredients);
    setDrinks(newDrinks);
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  if (drinks === undefined) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell" />
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {drinks.map((drink) => {
            return (
              <Grid item md={6}>
                <DrinkCard drink={drink} />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
};

export default Home;
