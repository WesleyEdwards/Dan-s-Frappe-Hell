import { Container, Grid, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { DFHeader } from "../components/DFHeader";
import { DrinkCard } from "../components/DrinkCard";
import { Loading } from "../components/Loading";
import { getMenuItems, MenuItem} from "../sdk";

export const Home: FC = () => {


  const[menuitems, setMenuItems] = useState<MenuItem[]>([]);


  useEffect(() => {
    getMenuItems().then((res) => {
      setMenuItems(res);
    });
  },[]);

  if(menuitems.length === 0) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Welcome to Dan's Frappuccino Hell" />
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {menuitems.map((menuitem) => {
            return (
              <Grid item md={6}>
                <DrinkCard
                  menuitem={menuitem}
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
