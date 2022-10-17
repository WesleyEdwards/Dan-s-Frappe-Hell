import {Container, Grid, Stack, Typography} from "@mui/material";
import React, { FC, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";

export const Home: FC = () => {
  const [drinks, setDrinks] = useState(["Frappe", "Cappuccino", "Latte", "Mocha", "Flat White", "Vanilla Bean"]);

  const addDrink = (newDrink: string) => {
    setDrinks([...drinks, newDrink]);
  };

  return (
    <Container maxWidth="md">
      <Typography>There are {drinks.length}</Typography>
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell" />
          <Grid container rowSpacing={4} columnSpacing={{md:8}}>
                {drinks.map((drink) => {
                    return <Grid item md={6}><DrinkCard drink={drink} description={"This is a description"} addDrink={addDrink}/></Grid>;
                })}
          </Grid>
      </Stack>
    </Container>
  );
};

export default Home;
