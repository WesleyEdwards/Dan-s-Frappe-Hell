import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DisplayOrder, MenuItem, Order } from "../api/models";
import { getCartOrder, getMenuItems, updateOrder } from "../api/api-functions";
import { Loading } from "./Loading";
import { createDisplayOrderFromOrder } from "../utils/helperFunctions";
import { useAuth } from "../utils/AuthContext";

export const ViewCart: FC = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();
  const [myOrder, setMyOrder] = useState<Order>();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleCheckOut = () => {
    if (!myOrder) return;
    updateOrder(
      myOrder.OrderId,
      myOrder.Items,
      myOrder.Favorite,
      "PLACED"
    ).then(() => {
      fetchCartOrder();
    });
  };

  const fetchCartOrder = async () => {
    if (!user) return;
    const myOrder: Order = await getCartOrder(user.userId);
    const menuItems: MenuItem[] = await getMenuItems();
    setMyOrder(myOrder);
    const displayOrder: DisplayOrder = createDisplayOrderFromOrder(
      myOrder,
      menuItems
    );
    setDisplayOrder(displayOrder);
  };

  useEffect(() => {
    fetchCartOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!myOrder) return <Loading />;

  return (
    <>
      <IconButton
        aria-label="cart"
        onClick={handleOpen}
        sx={{ width: "4rem", height: "4rem" }}
      >
        {myOrder.Items.length > 0 ? (
          <Badge color="secondary" badgeContent={myOrder.Items.length}>
            <ShoppingCartIcon fontSize="medium" />
          </Badge>
        ) : (
          <ShoppingCartIcon fontSize="medium" />
        )}
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ width: 400 }}>
          <ShoppingCartIcon fontSize="large" />
          <>
            {(() => {
              if (myOrder.Items.length === 0 && myOrder.Status === "CART") {
                return (
                  <Typography align="center" sx={{ my: "4rem" }}>
                    You Have Nothing In Your Cart.
                  </Typography>
                );
              }
              if (myOrder.Status !== "CART") {
                return (
                  <Typography align="center" sx={{ my: "4rem" }}>
                    Your order is being processed. Thank you for your patience.
                  </Typography>
                );
              }
              if (!displayOrder) return <Loading />;
              return (
                <>
                  <Typography variant="h4" align="center">
                    My Cart
                  </Typography>
                  <Divider sx={{ my: "2rem" }} />
                  <List>
                    {displayOrder.orderItems.map((item, i) => {
                      return (
                        <ListItem key={i}>
                          <ListItemText
                            primary={`${item.quantity} - ${item.drinkName} - $${item.price}`}
                          />
                        </ListItem>
                      );
                    })}
                    <Divider sx={{ my: "2rem" }} />
                    <ListItem>
                      <ListItemText
                        primary={`Total: $${displayOrder.totalPrice}`}
                      />
                    </ListItem>
                  </List>
                </>
              );
            })()}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {myOrder.Items.length > 0 && (
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
