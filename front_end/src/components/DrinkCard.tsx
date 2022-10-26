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
import { FC, useState, useEffect } from "react";
import {Drink, MappingOfIngredientToQuantity, MenuItem, Order, OrderItem, RecipeItem} from "../api/models";
import { IngredientSelect } from "./IngredientSelect";
import {getCartOrder, getMenuItemById, getMenuItemByRecipe, updateOrder} from "../api/api-functions";
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
  const[returnRecipe, setReturnRecipe] = useState<MappingOfIngredientToQuantity>({})


  const fetchCartOrder = () => {
    if(!user) return;
    setStaticCartOrder(undefined);
    setDynamicCartOrder(undefined)
    getCartOrder(user.userId).then((res)=>setStaticCartOrder(res))
  };

  useEffect(() => {
    fetchCartOrder();
  }, [user]);

  const handleAddToCart = async () => {

    if (!staticCartOrder || !user || !returnRecipe) return;
    const newList: OrderItem[] = [];
    let duplicate = false;
    let rec: MenuItem;
    await getMenuItemByRecipe(returnRecipe).then((res)=>{
      rec = res
    }).then(()=>{
      getCartOrder(user.userId).then((res)=>{
        res.Items.forEach((i)=>{
          console.log("In for each")
          if(i.menuId === rec.MenuId){
            console.log("Running upper for each")
            const q = i.quantity += 1
            duplicate = true
            return newList.push({menuId: rec.MenuId, quantity:q, price:0})
          }else{
            console.log("Running lower for each")
            return newList.push(i)
          }
        })
        console.log("Im here and duplicate is " + duplicate)
        console.log("Newlist is" + newList)
        if(!duplicate) {
          console.log("In if statement")
          newList.push({menuId: rec.MenuId, quantity: 1, price: 0})
        }
        console.log("New List: " + newList)
        updateOrder(staticCartOrder.OrderId, newList, false, "CART").then((res) =>{
          console.log("Updated Return: " + res.Items)
          setDynamicCartOrder(res)
        })
      })

    })

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
                returnRecipe[recipeItem.ingredient.IngredientId] = recipeItem.quantity
                return (
                    <FormControl style={{ width: 400, paddingBottom: 35 }} error>
                      <IngredientSelect
                          recipe={returnRecipe}
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
