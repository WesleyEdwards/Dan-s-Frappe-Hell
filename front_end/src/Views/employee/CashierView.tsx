import { Container, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getMenuItems } from "../../api/api-functions";
import { MenuItem } from "../../api/models";
import { DFHeader } from "../../components/DFHeader";
import { Loading } from "../../components/Loading";

export const CashierView: FC = () => {
  const [menuitems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    getMenuItems().then((res) => {
      setMenuItems(res);
    });
  }, []);

  if (menuitems.length === 0) return <Loading />;

  return (
    <Container maxWidth="md">
      <Stack gap="2rem" justifyContent="center">
        <DFHeader title="Cashier Portal" />
        <Typography variant="h5" gutterBottom>
          Create Customer Orders
        </Typography>
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {menuitems.map((menuitem) => {
            return <Grid item md={6}></Grid>;
          })}
        </Grid>
        <Typography variant="h5" gutterBottom>
          Customer Pickup
        </Typography>
        <Grid container rowSpacing={4} columnSpacing={{ md: 8 }}>
          {menuitems.map((menuitem) => {
            return <Grid item md={6}></Grid>;
          })}
        </Grid>
      </Stack>
    </Container>
  );
};

export default CashierView;
