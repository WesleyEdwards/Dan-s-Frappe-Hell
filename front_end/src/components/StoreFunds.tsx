import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import {
    Balance,
    getStoreBalance,
    incrementUserBalance,
} from "../api/api-functions";
import Loading from "../components/Loading";
import { useAuth } from "../utils/AuthContext";
import { roundToTwoDecimals } from "../utils/helperFunctions";
import DialogHeader from "./DialogHeader";
import AddIcon from "@mui/icons-material/Add";

export interface StoreFundsProps {
    refreshTrigger: Boolean;
}

export const StoreFunds: FC<StoreFundsProps> = (props) => {
    const { refreshTrigger } = props
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
        getStoreBalance().then((res) => {
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
    }, [user, refreshTrigger]);

    if (!user) return <Loading />;
    if (!balance) return <Loading />;
    return (
        <>
            <Stack direction="row" gap="2rem" alignItems="center">
                <IconButton onClick={handleOpen}>
                    <AddIcon />
                </IconButton>
                <Typography>Store Balance: ${balance.Balance}</Typography>
            </Stack>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Stack gap="2rem">
                        <DialogHeader title={`$${balance.Balance}`} />
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            gap="4rem"
                            alignItems="center"
                        >
                            <Typography>Add To Store Balance:</Typography>
                            <TextField
                                type={"number"}
                                label={"Amount"}
                                value={addAmount}
                                onChange={(e) =>
                                    setAddAmount(roundToTwoDecimals(parseFloat(e.target.value)))
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">$</InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" disabled={false} onClick={addFunds}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StoreFunds;
