import { Container, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { FC, useEffect, useState } from "react";
import CreateIngredient from "../../components/CreateIngredient";
import { DFHeader } from "../../components/DFHeader";
import { EditIngredientDialogue } from "../../components/EditIngredientDialogue";
import { Loading } from "../../components/Loading";
import { getIngredients } from "../../sdk";

export interface IngredientRow {
  id: string;
  kind: string;
  name: string;
  price: number;
  upCharge: number;
  stock: number;
}

export const Inventory: FC = () => {
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<
    IngredientRow | undefined
  >();

  const onSubmit = (ingredient: IngredientRow) => {
    alert("Edit ingredient is not implemented yet");
  };

  const handleClose = () => {
    setSelectedIngredient(undefined);
  };

  useEffect(() => {
    getIngredients().then((res) => {
      setIngredientRows([]);
      res.map((ingredient) => {
        return setIngredientRows((prev) => [
          ...prev,
          {
            id: ingredient.IngredientId,
            kind: ingredient.Kind,
            name: ingredient.Name,
            price: ingredient.Price ?? 0,
            upCharge: ingredient.Upcharge,
            stock: ingredient.Stock ?? 0,
          },
        ]);
      });
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      flex: 1,
    },
    { field: "stock", headerName: "Stock", width: 150, flex: 1 },
    {
      field: "kind",
      headerName: "Kind",
      width: 150,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 110,
    },
    {
      field: "upCharge",
      headerName: "Up Charge",
      description: "Amount of money increased for each.",
      sortable: true,
      type: "number",
      flex: 1,
    },
  ];

  return (
    <>
      <Container maxWidth="md">
        <DFHeader title="Inventory" />
        <Stack gap="2rem" justifyContent="center" sx={{ pb: 12 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Ingredients</Typography>
            <CreateIngredient />
          </Stack>
          {ingredientRows.length !== 0 ? (
            <DataGrid
              rows={ingredientRows}
              autoHeight={true}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[15]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: false }}
              onCellClick={(params) => {
                setSelectedIngredient(params.row);
              }}
            />
          ) : (
            <Loading />
          )}
        </Stack>
      </Container>
      <EditIngredientDialogue
        ingredient={selectedIngredient}
        handleClose={handleClose}
        onSubmitted={onSubmit}
      />
    </>
  );
};

export default Inventory;
