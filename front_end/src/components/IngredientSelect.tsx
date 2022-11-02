import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { FC, useState } from "react";
import { RecipeItem } from "../api/models";

interface IngredientSelectProps {
  recipeItem: RecipeItem;
  handleIngredientChange: (ingredient: RecipeItem) => void;
}

export const IngredientSelect: FC<IngredientSelectProps> = (props) => {
  const { recipeItem, handleIngredientChange } = props;

  const [error, setError] = useState<string | undefined>();

  const handleChange = (newQuantity: string) => {
    setError(undefined);
    const selected = parseInt(newQuantity) ?? 0;
    if (
      recipeItem.ingredient.Stock === undefined ||
      recipeItem.ingredient.Stock === null
    ) {
      return;
    }
    if (recipeItem.ingredient.Stock < selected) {
      setError("Sorry, there is not enough of this ingredient in stock");
    }

    handleIngredientChange({ ...recipeItem, quantity: selected });
  };

  return (
    <FormControl error={!!error}>
      <InputLabel>{recipeItem.ingredient.Name}</InputLabel>
      <Select
        value={recipeItem.quantity}
        label={recipeItem.ingredient.Name}
        onChange={(e) => handleChange(e.target.value.toString())}
      >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
