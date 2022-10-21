import { Button } from "@mui/material";
import React, { FC, useState } from "react";
import { createIngredient, IngredientType } from "../sdk";
import { EditIngredientDialogue } from "./EditIngredientDialogue";
import { IngredientRow } from "./IngredientsEdit";

interface CreateIngredientProps {
  refreshIngredientList: () => void;
}
export const CreateIngredient: FC<CreateIngredientProps> = (props) => {
  const { refreshIngredientList } = props;
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
    createIngredient({
      Kind: ingredient.kind as IngredientType,
      Name: ingredient.name,
      Price: ingredient.price,
      Stock: ingredient.stock,
      Upcharge: ingredient.upCharge,
    })
      .then(refreshIngredientList)
      .then(handleClose);
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
        submitIngredient={createNewIngredient}
      />
    </>
  );
};

export default CreateIngredient;
