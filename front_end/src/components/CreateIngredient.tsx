import { Button } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { createIngredient, getIngredientKinds, IngredientType } from "../sdk";
import { IngredientRow } from "../Views/admin/Inventory";
import { EditIngredientDialogue } from "./EditIngredientDialogue";

export const CreateIngredient: FC = () => {
  const [ingredient, setIngredient] = useState<IngredientRow | undefined>();

  const handleClose = () => {
    setIngredient(undefined);
  };
  const handleOpen = () => {
    setIngredient({
      id: "-1",
      kind: IngredientType.ADDIN,
      name: "",
      price: 0,
      upCharge: 0,
      stock: 0,
    });
  };

  const createNewIngredient = (ingredient: IngredientRow) => {
    createIngredient(ingredient).then((res) => {
      console.log(res);
    });
  };
  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        New Ingredient
      </Button>
      <EditIngredientDialogue
        ingredient={ingredient}
        handleClose={handleClose}
        newIngredient={true}
        onSubmitted={createNewIngredient}
      />
    </>
  );
};

export default CreateIngredient;
