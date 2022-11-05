import { Dialog } from "@mui/material";
import React, { FC, useState } from "react";
import EditIngredientDialogue from "./EditIngredientDialogue";
import { EditStockDialogue } from "./EditStockDialogue";
import { IngredientRow } from "./IngredientsEdit";

interface EditIngredientDialogueProps {
  ingredient: IngredientRow;
  handleClose: () => void;
  submitIngredient: (ingredient: IngredientRow) => void;
}
export const ViewIngredientDialogue: FC<EditIngredientDialogueProps> = (
  props
) => {
  const { ingredient, handleClose, submitIngredient } = props;

  const [editIngredient, setEditIngredient] = useState(false);

  if (ingredient === undefined) return <></>;
  return (
    <Dialog
      open={ingredient !== undefined}
      onClose={handleClose}
      fullWidth={true}
    >
      {editIngredient ? (
        <EditIngredientDialogue
          ingredient={ingredient}
          handleClose={handleClose}
          submitIngredient={submitIngredient}
          handleBack={() => setEditIngredient(false)}
        />
      ) : (
        <EditStockDialogue
          ingredient={ingredient}
          handleClose={handleClose}
          submitIngredient={submitIngredient}
          editIngredient={() => setEditIngredient(true)}
        />
      )}
    </Dialog>
  );
};

export default ViewIngredientDialogue;
