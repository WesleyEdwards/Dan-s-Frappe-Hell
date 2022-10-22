import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { FC, useEffect, useState } from "react";
import { getIngredients } from "../api/api-functions";
import { Loading } from "./Loading";

export interface IngredientRow {
  id: string;
  kind: string;
  name: string;
  price: number;
  upCharge: number;
  stock: number;
}
interface IngredientsEditProps {
  refreshTrigger: boolean;
  setSelectedIngredient: (ingredient: IngredientRow | undefined) => void;
}

export const IngredientsEdit: FC<IngredientsEditProps> = (props) => {
  const { refreshTrigger, setSelectedIngredient } = props;

  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([]);

  const refreshIngredientList = () => {
    const newList: IngredientRow[] = [];
    getIngredients()
      .then((res) => {
        res.map((ingredient) => {
          return newList.push({
            id: ingredient.IngredientId,
            kind: ingredient.Kind,
            name: ingredient.Name,
            price: ingredient.Price ?? 0,
            upCharge: ingredient.Upcharge,
            stock: ingredient.Stock ?? 0,
          });
        });
      })
      .then(() => setIngredientRows(newList));
  };

  useEffect(() => {
    refreshIngredientList();
  }, [refreshTrigger]);

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
      {ingredientRows.length !== 0 ? (
        <DataGrid
          rows={ingredientRows}
          autoHeight={true}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[15]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: false }}
          onCellClick={(params) => setSelectedIngredient(params.row)}
        />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default IngredientsEdit;
