import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getAllUsers } from "../api/api-functions";
import { DisplayOrder } from "../api/models";
import { useAuth } from "../utils/AuthContext";
import { checkStockAndCost } from "../utils/helperFunctions";
import CartList from "./CartList";
import DialogHeader from "./DialogHeader";
import Loading from "./Loading";

interface CashierCheckoutModalProps {
  onCheckout: (userId: string) => Promise<unknown>;
  displayOrder: DisplayOrder;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  label: string;
}

export const CashierCheckoutModal: FC<CashierCheckoutModalProps> = (props) => {
  const { onCheckout, displayOrder } = props;
  const [open, setOpen] = useState(false);
  const [userRowList, setUserRowList] = useState<UserRow[]>();
  const [selectedUser, setSelectedUser] = useState<UserRow>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const newUsers: UserRow[] = [];
    getAllUsers()
      .then((users) => {
        users.map((user) => {
          return newUsers.push({
            id: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            label: user.email,
          });
        });
      })
      .then(() => {
        setUserRowList(newUsers);
      });
  }, []);

  const handleClose = () => {
    setError(undefined);
    setSelectedUser(undefined);
    setOpen(false);
  };
  const handleCheckout = async () => {
    setError(undefined);
    if (!selectedUser) return;

    const issue = await checkStockAndCost(selectedUser.id, displayOrder);

    if (issue.checkoutType === "InsufficientStock") {
      setError(`Insufficient stock for ${issue.item}`);
      return;
    }
    if (issue.checkoutType === "InsufficientFunds") {
      setError("Insufficient funds");
      return;
    }

    onCheckout(selectedUser.id);
    handleClose();
    setSelectedUser(undefined);
  };

  if (!userRowList) return <Loading />;
  return (
    <>
      <Button
        disabled={displayOrder.orderItems.length === 0}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Checkout
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogHeader title={"Checkout"} />
        <DialogContent>
          {displayOrder ? (
            <CartList displayOrder={displayOrder} />
          ) : (
            <Typography>Cart is empty</Typography>
          )}
          <Autocomplete
            disablePortal
            options={userRowList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="email" />}
            value={selectedUser}
            onChange={(event, newValue) => {
              if (!newValue) return;
              setError(undefined);
              setSelectedUser(newValue);
            }}
          />
        </DialogContent>
        {error && (
          <Alert severity="error" sx={{ my: "1rem" }}>
            {error}
          </Alert>
        )}
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={selectedUser === undefined}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CashierCheckoutModal;
