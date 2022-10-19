import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FC, useState } from "react";
import { Ingredient } from "../sdk";

interface IngredientSelectProps {
  ingredient: Ingredient;
}

export const IngredientSelect: FC<IngredientSelectProps> = (props) => {
  const { ingredient } = props;
  const [isError, setIsError] = useState(false);

  const [selectedValue, setSelectedValue] = useState<number>(1);

  const handleChange = (event: SelectChangeEvent) => {
    setIsError(false);
    const selected = parseInt(event.target.value) ?? 0;
    setSelectedValue(selected);
    if (ingredient.Stock === undefined || ingredient.Stock === null) return;
    if (ingredient.Stock < selected) {
      setIsError(true);
    }
  };
  const displayError = () => {
    if (isError) {
      return (
        <FormHelperText>
          Sorry, we don't have enough {ingredient.Name} available. Please select
          a lower quantity.
        </FormHelperText>
      );
    } else {
      return;
    }
  };

  return (
    <FormControl style={{ width: 400, paddingBottom: 20 }} error={isError}>
      <InputLabel style={{ paddingBottom: 20 }}>{ingredient.Name}</InputLabel>
      <Select
        value={selectedValue.toString()}
        label={ingredient.Name}
        onChange={handleChange}
      >
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
      {displayError()}
    </FormControl>
  );
};
