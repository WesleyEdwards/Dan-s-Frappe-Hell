import {
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
import CartList from "./CartList";
import DialogHeader from "./DialogHeader";
import Loading from "./Loading";

interface CashierCheckoutModalProps {
  onCheckout: (userId: string) => void;
  displayOrder: DisplayOrder | undefined;
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
  const [userList, setUserList] = useState<UserRow[]>();
  const [selectedUser, setSelectedUser] = useState<UserRow>();

  useEffect(() => {
    setUserList(undefined);
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
        setUserList(newUsers);
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(undefined);
  };
  const handleCheckout = () => {
    if (!selectedUser) return;
    onCheckout(selectedUser.id);
    handleClose();
    setSelectedUser(undefined);
  };

  if (!userList) return <Loading />;
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
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
            options={userList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="email" />}
            value={selectedUser}
            onChange={(event, newValue) => {
              if (!newValue) return;
              setSelectedUser(newValue);
            }}
          />
        </DialogContent>
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
