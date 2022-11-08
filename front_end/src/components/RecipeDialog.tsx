import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getAllMenuItems, getIngredients } from "../api/api-functions";
import { DisplayOrder, Drink } from "../api/models";
import { mapMenuItemsToIngredients } from "../utils/helperFunctions";
import { DFHDialogActions } from "./DFHDialogActions";
import DialogHeader from "./DialogHeader";
import Loading from "./Loading";

interface RecipeDialogProps {
  order: DisplayOrder;
}
export const RecipeDialog: FC<RecipeDialogProps> = (props) => {
  const { order } = props;
  const [open, setOpen] = useState(false);

  const [drinks, setDrinks] = useState<Drink[] | undefined>();

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fetchDrinks = async () => {
    const menuItems = await getAllMenuItems();
    const neededMenuItems = menuItems.filter((menuItem) => {
      return order.orderItems.some((orderItem) => {
        return orderItem.itemId === menuItem.MenuId.toString();
      });
    });
    const ingredients = await getIngredients();
    setDrinks(mapMenuItemsToIngredients(neededMenuItems, ingredients));
  };

  useEffect(() => {
    fetchDrinks();
  });

  if (drinks === undefined) return <Loading />;
  return (
    <>
      <Button onClick={handleClick}>Recipe</Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <DialogHeader title="Recipes" />
          {drinks.map((drink, i) => (
            <>
              <Typography paddingTop="2rem" variant="h5">
                {drink.menuItem.Name}
              </Typography>
              <List>
                {drink.recipe.map((recipe, j) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`${recipe.ingredient.Name} - ${recipe.quantity}`}
                      key={`${recipe.ingredient.Name}-${j}`}
                    />
                    <Divider />
                    {i <= order.orderItems.length && <Divider />}
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          ))}
        </DialogContent>
        <DFHDialogActions handleClose={handleClose} />
      </Dialog>
    </>
  );
};
