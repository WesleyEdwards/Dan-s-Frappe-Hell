import {
  Alert,
  Button,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Drink } from "../../api/models";

export interface OrderDrinkProps {
  drink: Drink;
  handleClose: () => void;
  handleSubmit: () => Promise<unknown>;
  customizeDrink: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  price: number;
}

export const OrderDrink: FC<OrderDrinkProps> = (props) => {
  const {
    drink,
    handleClose,
    handleSubmit,
    customizeDrink,
    quantity,
    setQuantity,
    price,
  } = props;

  const [error, setError] = useState<string | undefined>();

  const onSubmit = async () => {
    setError(undefined);

    handleSubmit().catch(() => setError("Failed to add to cart"));
  };

  return (
    <>
      <Stack padding="4rem" justifyContent="center" gap="1rem">
        <Stack gap="2rem" marginBottom="2rem">
          <DialogContentText variant="h4" sx={{ flex: 1 }}>
            {drink.menuItem.Name}
          </DialogContentText>
          <Button
            variant="contained"
            sx={{ alignSelf: "flex-start" }}
            onClick={customizeDrink}
          >
            Customize
          </Button>
        </Stack>
        <List>
          {drink.recipe.map((recipeItem) => {
            return (
              <ListItem key={recipeItem.ingredient.IngredientId}>
                <ListItemText
                  primary={`${recipeItem.ingredient.Name} - ${recipeItem.quantity}`}
                />
              </ListItem>
            );
          })}
        </List>
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
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Add To Cart
        </Button>
      </DialogActions>
    </>
  );
};

export default OrderDrink;
