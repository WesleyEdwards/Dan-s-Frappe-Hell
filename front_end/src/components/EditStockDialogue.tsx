import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import DialogHeader from "./DialogHeader";
import { IngredientRow } from "./IngredientsEdit";

interface EditStockDialogueProps {
  ingredient: IngredientRow;
  handleClose: () => void;
  submitIngredient: (ingredient: IngredientRow) => void;
  editIngredient: () => void;
}
export const EditStockDialogue: FC<EditStockDialogueProps> = (props) => {
  const { ingredient, handleClose, submitIngredient, editIngredient } = props;

  const [addStock, setAddStock] = useState<number>(0);

  const onSubmit = () => {
    if (!ingredient) return;
    submitIngredient({
      ...ingredient,
      stock: addStock,
    });
    handleClose();
  };

  return (
    <>
      <DialogContent>
        <Stack gap="2rem">
          <DialogHeader title={ingredient.name} onEdit={editIngredient} />
          <Typography>Current Stock: TODO</Typography>
          <Divider />
          <Stack
            direction="row"
            justifyContent="flex-start"
            gap="4rem"
            alignItems="center"
          >
            <Typography>Add To Stock:</Typography>
            <TextField
              value={addStock}
              type="number"
              name={ingredient.name}
              label={ingredient.name}
              onChange={(e) => setAddStock(parseInt(e.target.value))}
            />
          </Stack>
          {addStock > 0 && (
            <Alert severity="info">
              This will deduct TODO from the store balance
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={false} onClick={onSubmit}>
          Save
        </Button>
      </DialogActions>
    </>
  );
};
