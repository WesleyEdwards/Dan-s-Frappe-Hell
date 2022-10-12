import { Container, Stack, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";

export const Home: FC = () => {
  const [drinks, setDrinks] = useState(["Frappe"]);

  const addDrink = (newDrink: string) => {
    setDrinks([...drinks, newDrink]);
  };

  return (
    <Container maxWidth="md">
      <Typography>There are {drinks.length}</Typography>
      <Stack gap="8rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell." />
        <Typography align="center">Frappuccinos to Come</Typography>
        {drinks.map((drink) => {
          return <DrinkCard drink={drink} addDrink={addDrink}/>;
        })}
      </Stack>
    </Container>
  );
};

export default Home;
