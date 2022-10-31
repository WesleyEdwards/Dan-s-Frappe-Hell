import { Button } from "@mui/material";
import React, { FC, useState } from "react";
import { createIngredient } from "../api/api-functions";
import { IngredientType } from "../api/models";
import { useAuth } from "../utils/AuthContext";
import { emptyIngredientObject } from "../utils/constants";
import { hasPermission } from "../utils/userHelperFunctions";
import { EditIngredientDialogue } from "./EditIngredientDialogue";
import { IngredientRow } from "./IngredientsEdit";

interface CreateIngredientProps {
  refreshIngredientList: () => void;
}
export const CreateIngredient: FC<CreateIngredientProps> = (props) => {
  const { refreshIngredientList } = props;
  const [ingredient, setIngredient] = useState<IngredientRow | undefined>();
  const { user } = useAuth();

  const handleClose = () => {
    setIngredient(undefined);
  };
  const handleOpen = () => {
    setIngredient(emptyIngredientObject);
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
      {hasPermission(user, "Manager") && (
        <Button onClick={handleOpen} variant="contained">
          New Ingredient
        </Button>
      )}
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
