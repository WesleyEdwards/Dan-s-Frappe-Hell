import { Container, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";
const backendUrl = "http://localhost:5000";

export const Home: FC = () => {
  useEffect(() => {
    fetchData();
  }, []);

  const [drinks, setDrinks] = useState([
    "Frappe",
    "Cappuccino",
    "Latte",
    "Mocha",
    "Flat White",
    "Vanilla Bean",
  ]);

  const [ingredients, setIngredients] = useState([""]);

  async function fetchData() {
    fetch(`${backendUrl}/ingredients/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        const ingredientNames = [];
        let result = json.ingredients;
        console.log(result);
        for (let i of result) {
          ingredientNames.push(i.Name);
        }
        setIngredients(result);
      });
  }

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
