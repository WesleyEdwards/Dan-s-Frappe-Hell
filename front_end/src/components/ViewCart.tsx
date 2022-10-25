import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import React, { FC, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getCartOrder } from "../api/api-functions";
import { useAuth } from "../utils/AuthContext";
import { Loading } from "./Loading";
import { Order } from "../api/models";

export const ViewCart: FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const handleCartClick = () => {
    setOpen(true);
  };
  const handleCartClose = () => {
    setOpen(false);
  };
  const handleCheckOut = () => {
    //Todo handle checkout
    setOpen(false);
  };

  const [cartOrder, setCartOrder] = useState<Order>();

  const fetchCartOrder = async () => {
    if (!user?.userId) return;
    setCartOrder(undefined);
    const orders = await getCartOrder(user.userId);
    setCartOrder(orders);
  };

  useEffect(() => {
    fetchCartOrder();
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
        {/*<Badge badgeContent={cartOrder?.Items.length} color="secondary">*/}
        <ShoppingCartIcon />
        {/*</Badge>*/}
      </IconButton>

      <Dialog open={open} onClose={handleCartClose}>
        <DialogContent>
          <DialogContentText>Your Cart</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCartClose}>Close Cart</Button>
          <Button onClick={handleCheckOut}>Checkout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewCart;
