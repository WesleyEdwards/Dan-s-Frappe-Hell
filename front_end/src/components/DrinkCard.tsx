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
import { FC, useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Drink, Order, OrderItem } from "../api/models";
import { IngredientSelect } from "./IngredientSelect";
import { getCartOrder, updateOrder } from "../api/api-functions";

interface DrinkCardProps {
  drink: Drink;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user } = useAuth();
  const [cartOrder, setCartOrder] = useState<Order>();
  const fetchCartOrder = async () => {
    setCartOrder(undefined);
    const order = await getCartOrder(user?.userId || " ");
    setCartOrder(order);
  };

  useEffect(() => {
    fetchCartOrder();
  }, []);

  const handleAddToCart = () => {
    if (!cartOrder) return;
    const newList: OrderItem[] = [];
    console.log(cartOrder.Items);
    cartOrder.Items.forEach((i) => {
      return newList.push(i);
    });
    newList.push({ menuId: drink.menuItem.MenuId, quantity: 1, price: 0 });
    return updateOrder(cartOrder.OrderId, newList, false, "CART");
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
