import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DisplayOrder, Order } from "../api/models";
import { Loading } from "./Loading";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

interface CartDialogueProps {
  open: boolean;
  handleClose: () => void;
  handleCheckOut: () => void;
  myCart: Order | undefined;
  myOrders: Order[] | undefined;
  displayOrder: DisplayOrder | undefined;
}
export const CartDialogue: FC<CartDialogueProps> = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { open, handleClose, handleCheckOut, myCart, displayOrder, myOrders } =
    props;

  const navigateToLogin = () => {
    handleClose();
    navigate("/login");
  };

  const processingOrder = (() => {
    const has = myOrders?.filter(
      (order) => order.Status === "PLACED" || order.Status === "FINISHED"
    );
    const cart = myOrders?.filter(
      (order) => order.Status === "CART" && order.Items.length === 0
    );
    if (!cart || !has) return false;
    return cart.length > 0 && has.length > 0;
  })();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <ShoppingCartIcon fontSize="large" />
        <>
          {(() => {
            if (!user || !displayOrder || !myCart) {
              return (
                <Stack justifyContent="center">
                  <Button
                    variant="contained"
                    sx={{ my: "1rem", alignSelf: "center" }}
                    onClick={navigateToLogin}
                  >
                    Sign In
                  </Button>
                </Stack>
              );
            }
            if (processingOrder) {
              return (
                <Typography align="center" sx={{ my: "4rem" }}>
                  Your order is being processed. Thank you for your patience.
                </Typography>
              );
            }
            if (myCart.Items.length === 0) {
              return (
                <Typography align="center" sx={{ my: "4rem" }}>
                  Your cart is empty. Pick a drink and start
                  ordering!
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
        {!!myCart?.Items?.length && myCart.Items.length > 0 && (
          <Button variant="contained" onClick={handleCheckOut}>
            Checkout
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CartDialogue;
