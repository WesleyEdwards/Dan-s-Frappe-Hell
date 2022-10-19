import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  TextField,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { IngredientRow } from "../Views/admin/Inventory";

interface EditIngredientDialogueProps {
  ingredient: IngredientRow | undefined;
  handleClose: () => void;
}
export const EditIngredientDialogue: FC<EditIngredientDialogueProps> = (
  props
) => {
  const { ingredient, handleClose } = props;

  const [upCharge, setUpCharge] = useState<number | undefined>();
  const [price, setPrice] = useState<number | undefined>();
  const [stock, setStock] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();

  const onClose = () => {
    setUpCharge(undefined);
    setPrice(undefined);
    setStock(undefined);
    setName(undefined);
    handleClose();
  };

  useEffect(() => {
    setUpCharge(ingredient?.upCharge);
    setPrice(ingredient?.price);
    setStock(ingredient?.stock);
    setName(ingredient?.name);
  }, [ingredient]);

  const saveEditedIngredient = () => {
    alert("Save changed ingredients is NOT implemented yet");
  };
  if (ingredient === undefined) return <></>;
  return (
    <Dialog open={ingredient !== undefined} onClose={onClose} fullWidth={true}>
      <DialogContent>
        <Stack gap="2rem">
          <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
            {ingredient.name}
          </DialogContentText>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            sx={{ flex: 1 }}
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(
                Number(e.target.value) === 0
                  ? undefined
                  : Number(e.target.value)
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Stack direction="row" gap="1rem">
            <TextField
              sx={{ flex: 1 }}
              label="Up Charge"
              type="number"
              value={upCharge}
              onChange={(e) =>
                setUpCharge(
                  Number(e.target.value) === 0
                    ? undefined
                    : Number(e.target.value)
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ flex: 1 }}
              label="Up Charge"
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(
                  Number(e.target.value) === 0
                    ? undefined
                    : Number(e.target.value)
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={
            (ingredient.upCharge === upCharge &&
              ingredient.price === price &&
              ingredient.name === name &&
              ingredient.stock === stock) ||
            !upCharge ||
            !price ||
            !name ||
            !stock
          }
          onClick={saveEditedIngredient}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
