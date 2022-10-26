import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Order, MenuItem } from "../api/models";
import { getCartOrder, getMenuItems, updateOrder } from "../api/api-functions";
import { useAuth } from "../utils/AuthContext";
import { Loading } from "./Loading";

export interface ViewCartProps {
  userId: string;
}
export const ViewCart: FC<ViewCartProps> = (props) => {
  const { userId } = props;

  const [open, setOpen] = useState(false);
  const [mappedMenuItems, setMappedMenuItems] = useState<MenuItem[]>();

  const [cartOrder, setCartOrder] = useState<Order>();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleCheckOut = () => {
    if (!cartOrder) return;
    updateOrder(
      cartOrder.OrderId,
      cartOrder.Items,
      cartOrder.Favorite,
      "PLACED"
    ).then(() => {
      fetchCartOrder();
      handleClose();
    });
  };

  const fetchCartOrder = async () => {
    getCartOrder(userId).then(setCartOrder);
    const newList: MenuItem[] = [];
    const cartOrder = await getCartOrder(userId);
    const menuItems = await getMenuItems();

    cartOrder.Items.map((item) => {
      return menuItems.find((menuItem) => {
        if (menuItem.MenuId === item.menuId) {
          return newList.push(menuItem);
        }
        return null;
      });
    });
    setMappedMenuItems(newList);
  };

  useEffect(() => {
    fetchCartOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!cartOrder) return <Loading />;

  return (
    <>
      <IconButton
        aria-label="cart"
        onClick={handleOpen}
        sx={{ width: "4rem", height: "4rem" }}
      >
        {cartOrder.Items.length > 0 ? (
          <Badge variant="dot" color="secondary">
            <ShoppingCartIcon fontSize="medium" />
          </Badge>
        ) : (
          <ShoppingCartIcon fontSize="medium" />
        )}
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ width: 400 }}>
          <ShoppingCartIcon fontSize="large" />
          {cartOrder.Items.length === 0 ? (
            <Typography align="center">
              You Have Nothing In Your Cart
            </Typography>
          ) : (
            <>
              <Typography align="center">
                You Have Something In Your Cart
              </Typography>
              {/* {mappedMenuItems.map((item) => {
                return (
                  <FormControl style={{ width: 400, paddingBottom: 35 }} error>
                    <Typography>{item.Name}</Typography>
                  </FormControl>
                );
              })} */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {cartOrder.Items.length > 0 && (
            <Button variant="contained" onClick={handleCheckOut}>
              Checkout
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewCart;
