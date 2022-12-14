import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DisplayOrder, DisplayOrderItem, Order } from "../api/models";
import { Loading } from "./Loading";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import CartList from "./CartList";
import { checkStockAndCost } from "../utils/helperFunctions";
import { DFHDialogActions } from "./DFHDialogActions";

interface CartDialogueProps {
  open: boolean;
  handleClose: () => void;
  handleCheckOut: () => Promise<unknown>;
  myCart: Order | undefined;
  myOrders: Order[] | undefined;
  displayOrder: DisplayOrder | undefined;
  handleDelete: (deleteItem: DisplayOrderItem) => void;
}
export const CartDialogue: FC<CartDialogueProps> = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    open,
    handleClose,
    handleDelete,
    handleCheckOut,
    myCart,
    displayOrder,
    myOrders,
  } = props;

  const [error, setError] = useState<string>();

  const navigateToLogin = () => {
    handleClose();
    navigate("/login");
  };

  const onClose = () => {
    setError(undefined);
    handleClose();
  };

  const onDelete = (deleteItem: DisplayOrderItem) => {
    setError(undefined);
    handleDelete(deleteItem);
  };

  const handleDialogCheckout = async () => {
    if (!user || !displayOrder) return;
    setError(undefined);
    const issue = await checkStockAndCost(user.userId, displayOrder);

    if (issue.checkoutType === "InsufficientStock") {
      setError(`Insufficient stock for ${issue.item}`);
      return;
    }
    if (issue.checkoutType === "InsufficientFunds") {
      setError("Insufficient funds");
      return;
    }
    handleCheckOut().catch(() => setError("Insufficient Ingredients"));
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <>
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
                    Your cart is empty. Pick a drink and start ordering!
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
                  <CartList
                    handleDelete={onDelete}
                    displayOrder={displayOrder}
                  />
                </>
              );
            })()}
          </>
        </>
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DFHDialogActions
        handleClose={onClose}
        handleSubmit={handleDialogCheckout}
        submitText="Checkout"
        showSubmit={!!myCart?.Items?.length && myCart.Items.length > 0}
      />
      {/* <DialogActions>
        <Button onClick={onClose}>Close</Button>

        {!!myCart?.Items?.length && myCart.Items.length > 0 && (
          <Button variant="contained" onClick={handleDialogCheckout}>
            Checkout
          </Button>
        )}
      </DialogActions> */}
    </Dialog>
  );
};

export default CartDialogue;
