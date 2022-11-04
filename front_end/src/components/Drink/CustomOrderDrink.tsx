import {
  Button,
  DialogContentText,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
} from "@mui/material";
import { FC, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Drink,
  RecipeItem,
  MappingOfIngredientToQuantity,
} from "../../api/models";
import { IngredientSelect } from "../IngredientSelect";
import { createMenuItem } from "../../api/api-functions";
import {
  recipeItemsToRawRecipeItems,
  roundToTwoDecimals,
} from "../../utils/helperFunctions";
import { CustomOrderActions } from "./CustomOrderActions";
import DialogHeader from "../DialogHeader";

export interface CustomOrderDrinkProps {
  drink: Drink;
  customizeDrink: boolean;
  setCustomDrink: (bool: boolean) => void;
  handleClose: () => void;
  handleSubmit: (
    menuId: number,
    quantity: number,
    price: number
  ) => Promise<unknown>;
}

export const CustomOrderDrink: FC<CustomOrderDrinkProps> = (props) => {
  const { customizeDrink, drink, handleClose, handleSubmit, setCustomDrink } =
    props;

  const [error, setError] = useState<string | undefined>();
  const [ingredients, setIngredients] = useState<RecipeItem[]>(drink.recipe);
  const [price, setPrice] = useState(drink.menuItem.Price);
  const [quantity, setQuantity] = useState(1);

  const handleSubmitOrder = () => {
    setError(undefined);
    const newRecipe: MappingOfIngredientToQuantity =
      recipeItemsToRawRecipeItems(ingredients);
    createMenuItem(newRecipe)
      .then((menu) => handleSubmit(menu.MenuId, quantity, price))
      .catch(() => setError("Failed to add to cart"));
  };

  const handleIngredientChange = (recipeItem: RecipeItem) => {
    ingredients.forEach((currentIngredient) => {
      const currentIngredients = ingredients;
      if (
        currentIngredient.ingredient.IngredientId ===
        recipeItem.ingredient.IngredientId
      ) {
        const changedQuantity: number =
          recipeItem.quantity - currentIngredient.quantity;
        const changedPrice: number =
          changedQuantity * (recipeItem.ingredient.Upcharge ?? 0) * quantity;
        const newPrice = roundToTwoDecimals(price + changedPrice);
        setPrice(newPrice);
        currentIngredients.splice(
          currentIngredients.indexOf(currentIngredient),
          1,
          recipeItem
        );
        setIngredients([...currentIngredients]);
      }
    });
  };

  return (
    <Stack padding="4rem" justifyContent="center" gap="2rem">
      {customizeDrink ? (
        <>
          <DialogHeader
            title={drink.menuItem.Name}
            onBack={() => setCustomDrink(false)}
          />

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
        </>
      ) : (
        <>
          <DialogHeader
            title={drink.menuItem.Name}
            onEdit={() => setCustomDrink(true)}
            editTitle="Customize"
          />
          <List>
            {ingredients.map((recipeItem) => {
              return (
                <ListItem key={recipeItem.ingredient.IngredientId}>
                  <ListItemText
                    primary={`${recipeItem.ingredient.Name} - ${recipeItem.quantity}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}

      <CustomOrderActions
        error={error}
        handleSubmitOrder={handleSubmitOrder}
        handleClose={handleClose}
        price={price}
        setPrice={setPrice}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </Stack>
  );
};

export default CustomOrderDrink;
