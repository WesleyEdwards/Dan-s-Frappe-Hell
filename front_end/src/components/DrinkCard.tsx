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
import { Drink } from "../api/models";
import { IngredientSelect } from "./IngredientSelect";
import {Drink, getCartOrder, Order, updateOrder, OrderItem} from "../sdk";
import {useAuth} from "../utils/AuthContext";

interface DrinkCardProps {
  drink: Drink;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user } = useAuth();
  const [staticCartOrder, setStaticCartOrder] = useState<Order>();
  const [dynamicCartOrder, setDynamicCartOrder] = useState<Order>();


  const fetchCartOrder = async () => {
    setStaticCartOrder(undefined);
    setDynamicCartOrder(undefined)
    const order = await getCartOrder(user?.userId || "1");
    setStaticCartOrder(order);
  };

  useEffect(() => {
    fetchCartOrder();
  }, []);

  const handleAddToCart = async () => {

    if (!staticCartOrder) return;
    const newList: OrderItem[] = [];
    let duplicate = false;
    await getCartOrder(staticCartOrder.OrderId.toString()).then((res)=>{
      res.Items.forEach((i)=>{
        if(i.menuId === drink.menuItem.MenuId){
          const q = i.quantity += 1
          duplicate = true
          return newList.push({menuId: drink.menuItem.MenuId, quantity:q, price:0})
        }else{
          return newList.push(i)
        }
      })
      if(!duplicate) {
        newList.push({menuId: drink.menuItem.MenuId, quantity: 1, price: 0})
      }
      console.log("New List: " + newList)
      updateOrder(staticCartOrder.OrderId, newList, false, "CART").then((res) =>{
        console.log("Updated Return: " + res.Items)
        setDynamicCartOrder(res)
      })
    });
    // cartOrder.Items.forEach((i) => {
    //   return newList.push(i);
    // });
    setOpen(false)

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
