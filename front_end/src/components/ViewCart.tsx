import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, FormControl,
  IconButton, Typography,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import React, { FC, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {getCartOrder, Order, updateOrder, getMenuItemById, MenuItem} from "../sdk";
import {useAuth} from "../utils/AuthContext";
import {Loading} from "./Loading";


export const ViewCart: FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleCartClick = () => {
    const newList: MenuItem[]  = []
    getCartOrder(user?.userId || "1").then((res)=>{
      setCartOrder(res)
      res.Items.map((i)=>{
        getMenuItemById(i.menuId.toString()).then((red)=>{
          newList.push(red)
        })
      })
      setMenuItems(newList)
      setOpen(true);
    })

  };
  const handleCartClose = () => {
    setOpen(false);
  };

  const handleCheckOut = () => {
    if(!cartOrder) return;
    updateOrder(cartOrder.OrderId, cartOrder.Items, cartOrder.Favorite, "PLACED")
    alert("Need to implement subtracting of user balance")
    fetchCartOrder()
    setOpen(false);
  };

  const [cartOrder, setCartOrder] = useState<Order>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>();


  const fetchCartOrder = async () => {
    if(!user?.userId) return;
    getCartOrder(user.userId).then((red)=>{
      setCartOrder(red)
    });
  };

  useEffect(()=>{
    fetchCartOrder()
  }, [user]);


  if (!user) return <></>;
  if (cartOrder === undefined) {
    return <Loading />;
  }

  return (
    <>
      <IconButton
        aria-label="cart"
        onClick={handleCartClick}
        sx={{ width: "4rem", height: "4rem" }}
      >
        {/*<Badge badgeContent={cartSize} color="secondary">*/}
          <ShoppingCartIcon />
        {/*</Badge>*/}
      </IconButton>

      <Dialog open={open} onClose={handleCartClose}>
        <DialogContent style={{width:400}}>
          <DialogContentText>Your Cart</DialogContentText>
          {cartOrder.Items.length == 0 && <Typography>You Have Nothing In Your Cart</Typography>}
          {!menuItems && <Loading/>}
          {menuItems && menuItems.map((item) => {
            return (
                <FormControl style={{ width: 400, paddingBottom: 35 }} error>
                  <Typography>{item.Name}</Typography>
                </FormControl>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCartClose}>Close Cart</Button>
          {cartOrder.Items.length > 0 && <Button onClick={handleCheckOut}>Checkout</Button>}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewCart;
