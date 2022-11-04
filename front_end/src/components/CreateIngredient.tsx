import { Button, Dialog } from "@mui/material";
import React, { FC, useState } from "react";
import { createIngredient } from "../api/api-functions";
import { IngredientType } from "../api/models";
import { useAuth } from "../utils/AuthContext";
import { hasPermission } from "../utils/userHelperFunctions";
import { IngredientRow } from "./IngredientsEdit";
import NewIngredientDialogue from "./NewIngredientDialogue";

interface CreateIngredientProps {
  refreshIngredientList: () => void;
}
export const CreateIngredient: FC<CreateIngredientProps> = (props) => {
  const { refreshIngredientList } = props;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
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
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <NewIngredientDialogue
          handleClose={handleClose}
          newIngredient={true}
          submitIngredient={createNewIngredient}
        />
      </Dialog>
    </>
  );
};

export default CreateIngredient;
