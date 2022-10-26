import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { FC, useState } from "react";
import { Ingredient } from "../api/models";

interface IngredientSelectProps {
  ingredient: Ingredient;
  initialQuantity: number;
}

export const IngredientSelect: FC<IngredientSelectProps> = (props) => {
  const { ingredient, initialQuantity } = props;

  const [error, setError] = useState<string | undefined>();
  const [selectedQuantity, setSelectedQuantity] =
    useState<number>(initialQuantity);

  const handleChange = (newQuantity: string) => {
    setError(undefined);
    const selected = parseInt(newQuantity) ?? 0;
    if (ingredient.Stock === undefined || ingredient.Stock === null) {
      return;
    }
    if (ingredient.Stock < selected) {
      setError("Sorry, there is not enough of this ingredient in stock");
    }

    setSelectedQuantity(selected);
  };

  return (
    <FormControl error={!!error}>
      <InputLabel>{ingredient.Name}</InputLabel>
      <Select
        value={selectedQuantity.toString()}
        label={ingredient.Name}
        onChange={(e) => handleChange(e.target.value)}
      >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={7}>7</MenuItem>
        <MenuItem value={8}>8</MenuItem>
        <MenuItem value={9}>9</MenuItem>
        <MenuItem value={10}>10</MenuItem>
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
