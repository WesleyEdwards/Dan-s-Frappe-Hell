import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { IngredientSelect } from "./IngredientSelect";
import { Drink } from "../sdk";

interface DrinkCardProps {
  drink: Drink;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddToCart = () => {
    alert("This feature is not yet implemented");
    handleClose();
  };

  return (
    <>
      <Card
        onClick={handleClick}
        style={{
          cursor: "pointer",
          minWidth: "200px",
          minHeight: "200px",
        }}
      >
        <CardContent style={{ justifyContent: "center" }}>
          <Typography variant="h5" gutterBottom>
            {drink.menuItem.Name}
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ width: 500 }}>
          <>
            <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
              Customize your {drink.menuItem.Name}
            </DialogContentText>
            {drink.recipe.map((recipeItem) => {
              return (
                <FormControl style={{ width: 400, paddingBottom: 35 }} error>
                  <IngredientSelect
                    ingredient={recipeItem.ingredient}
                    initialQuantity={recipeItem.quantity}
                  />
                </FormControl>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddToCart}>Add To Cart</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DrinkCard;
