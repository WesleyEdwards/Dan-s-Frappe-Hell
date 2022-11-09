import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
  Balance,
  getUserBalance,
  incrementUserBalance,
} from "../api/api-functions";
import Loading from "../components/Loading";
import { useAuth } from "../utils/AuthContext";
import { roundToTwoDecimals } from "../utils/helperFunctions";
import DialogHeader from "./DialogHeader";
import AddIcon from "@mui/icons-material/Add";
import { DFHDialogActions } from "./DFHDialogActions";
import MoneyField from "./MoneyField";

export const AccountFunds: FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<Balance | undefined>(undefined);
  const [addAmount, setAddAmount] = useState<number>(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const fetchBalance = () => {
    setBalance(undefined);
    if (!user) return;
    getUserBalance(user.userId).then((res) => {
      setBalance({ ...res, Balance: roundToTwoDecimals(res.Balance) });
    });
  };
  const addFunds = () => {
    if (!user || !balance) return;
    setAddAmount(0);
    incrementUserBalance(balance.BalanceId, addAmount).then(() => {
      fetchBalance();
      handleClose();
    });
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  if (!user) return <Loading />;
  if (!balance) return <Loading />;
  return (
    <>
      <Stack direction="row" gap="2rem" alignItems="center">
        <IconButton onClick={handleOpen}>
          <AddIcon />
        </IconButton>
        <Typography>Account Balance: ${balance.Balance}</Typography>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Stack gap="2rem">
            <DialogHeader title={`$${balance.Balance}`} />
            <MoneyField
              title={"Add Funds"}
              value={addAmount}
              onChange={setAddAmount}
              float
            />
          </Stack>
        </DialogContent>

        <DFHDialogActions handleClose={handleClose} handleSubmit={addFunds} />
      </Dialog>
    </>
  );
};

export default AccountFunds;
