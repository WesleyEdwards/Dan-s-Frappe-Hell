import { Alert, Badge, IconButton } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DisplayOrder, DisplayOrderItem, MenuItem, Order } from "../api/models";
import {
  getCartOrder,
  getAllMenuItems,
  getOrdersByUser,
  updateOrder,
} from "../api/api-functions";
import { createDisplayOrderFromOrder } from "../utils/helperFunctions";
import { useAuth } from "../utils/AuthContext";
import CartDialogue from "./CartDialogue";

export const ViewCart: FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [displayOrder, setDisplayOrder] = useState<
    DisplayOrder | null | undefined
  >();
  const [myCart, setMyCart] = useState<Order | undefined | null>();
  const [myOrders, setMyOrders] = useState<Order[] | undefined | null>();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleCheckOut = () => {
    if (!myCart) return Promise.reject();
    return updateOrder({
      OrderId: myCart.OrderId,
      Items: myCart.Items,
      Favorite: myCart.Favorite,
      Status: "PLACED",
    }).then(() => {
      fetchCartOrder();
    });
  };

  const handleDelete = (deleteItem: DisplayOrderItem) => {
    if (!myCart) return;
    const removedOrderItems = myCart.Items.filter(
      (item) =>
        item.menuId !== deleteItem.menuId ||
        item.quantity !== deleteItem.quantity
    );

    updateOrder({
      OrderId: myCart.OrderId,
      Items: removedOrderItems,
      Favorite: myCart.Favorite,
      Status: myCart.Status,
    }).then(() => {
      fetchCartOrder();
    });
  };

  const fetchCartOrder = async () => {
    setDisplayOrder(undefined);
    if (!user) return;
    const myCart: Order = await getCartOrder(user.userId);
    const menuItems: MenuItem[] = await getAllMenuItems();
    setMyCart(myCart);
    const displayOrder: DisplayOrder = createDisplayOrderFromOrder(
      myCart,
      menuItems
    );
    setDisplayOrder(displayOrder);

    const myOrders = await getOrdersByUser(user.userId);
    setMyOrders(myOrders);
  };

  useEffect(() => {
    fetchCartOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (displayOrder === null || myCart === null || myOrders === null)
    return <Alert severity="error">Error loading content</Alert>;

  return (
    <>
      <IconButton
        aria-label="cart"
        onClick={handleOpen}
        sx={{ width: "4rem", height: "4rem" }}
      >
        {myCart?.Items?.length && myCart.Items.length > 0 ? (
          <Badge color="secondary" badgeContent={myCart.Items.length}>
            <ShoppingCartIcon fontSize="medium" />
          </Badge>
        ) : (
          <ShoppingCartIcon fontSize="medium" />
        )}
      </IconButton>

      <CartDialogue
        open={open}
        handleClose={handleClose}
        myCart={myCart}
        myOrders={myOrders}
        handleCheckOut={handleCheckOut}
        displayOrder={displayOrder}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default ViewCart;
