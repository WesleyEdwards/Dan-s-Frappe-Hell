import {
  Button,
  DialogActions,
  DialogContentText,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Drink, RecipeItem } from "../../api/models";
import { IngredientSelect } from "../IngredientSelect";

export interface CustomOrderDrinkProps {
  drink: Drink;
  handleClose: () => void;
  handleSubmit: () => Promise<unknown>;
  standardDrink: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  price: number;
}

export const CustomOrderDrink: FC<CustomOrderDrinkProps> = (props) => {
  const {
    drink,
    handleClose,
    handleSubmit,
    standardDrink,
    quantity,
    setQuantity,
    price,
  } = props;

  const [ingredients, setIngredients] = useState<RecipeItem[]>(drink.recipe);

  const handleIngredientChange = (recipeItem: RecipeItem) => {
    console.log("recipeItem", recipeItem);
  };

  return (
    <>
      <Stack padding="4rem" justifyContent="center" gap="2rem">
        <Stack direction="row" gap="2rem" marginBottom="2rem">
          <IconButton>
            <ArrowBackIcon onClick={standardDrink} />
          </IconButton>
          <DialogContentText variant="h4" sx={{ flex: 1 }}>
            {drink.menuItem.Name}
          </DialogContentText>
        </Stack>
        {ingredients.map((recipeItem) => {
          return (
            <FormControl style={{ width: 400 }} error>
              <IngredientSelect
                recipeItem={recipeItem}
                handleIngredientChange={handleIngredientChange}
              />
            </FormControl>
          );
        })}
        <Stack
          direction="row"
          gap="4rem"
          justifyContent="left"
          marginTop="2rem"
          alignItems="center"
        >
          <FormControl sx={{ width: "8rem" }}>
            <InputLabel>Quantity</InputLabel>
            <Select
              value={quantity.toString()}
              label={"Quantity"}
              onChange={(e) => setQuantity(parseInt(e.target.value) ?? 1)}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="h5">{`$${price}`}</Typography>
        </Stack>
      </Stack>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            alert("This feature is not yet implemented.");
          }}
          variant="contained"
        >
          Add To Cart
        </Button>
      </DialogActions>
    </>
  );
};

export default CustomOrderDrink;
