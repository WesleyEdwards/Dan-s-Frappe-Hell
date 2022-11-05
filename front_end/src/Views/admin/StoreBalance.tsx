import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {FC, useState} from "react";
import { DFHeader } from "../../components/DFHeader";

export const StoreBalance: FC = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const addToBalance = () => {
        handleClose();
    }


    return (
        <Container maxWidth="md">
            <DFHeader title="Manage Store Balance" />
                <Stack direction="row" gap="2rem" justifyContent="flex-start">
                    <Button variant="contained" onClick={handleOpen}>Add Money To Store Balance</Button>
                </Stack>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContentText>Manage Store Balance</DialogContentText>
                <DialogContent>
                    <Stack>
                        <Typography variant={"subtitle2"}>Enter the amount of money you would like to add here</Typography>
                        <input type="number" id="balanceInput"></input>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {addToBalance()}}>Add To Balance</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default StoreBalance;
