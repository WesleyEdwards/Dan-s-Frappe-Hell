import { Container, Grid, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";
import { Loading } from "../components/Loading";
import { getIngredients, Ingredient } from "../sdk";

export const Home: FC = () => {
  const drinks = [
    "Frappe",
    "Cappuccino",
    "Latte",
    "Mocha",
    "Flat White",
    "Vanilla Bean",
  ];

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    getIngredients().then((res) => {
      setIngredients(res);
    });
  }, []);

  if (ingredients.length === 0) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell" />
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {drinks.map((drink) => {
            return (
              <Grid item md={6}>
                <DrinkCard
                  drink={drink}
                  description={"This is a description"}
                  ingredients={ingredients}
                />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
};

export default Home;
