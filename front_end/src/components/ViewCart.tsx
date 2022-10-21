import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import React, { FC, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const ViewCart: FC = () => {
  const [open, setOpen] = useState(false);
  const handleCartClick = () => {
    setOpen(true);
  };
  const handleCartClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        aria-label="cart"
        onClick={handleCartClick}
        sx={{ width: "4rem", height: "4rem" }}
      >
        <Badge badgeContent={4} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Dialog open={open} onClose={handleCartClose}>
        <DialogContent>
          <DialogContentText>Your Cart</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCartClose}>Close Cart</Button>
          <Button onClick={handleCartClose}>Checkout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewCart;
