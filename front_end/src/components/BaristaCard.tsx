import {
    Button,
    Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import {Order} from "../api/models";

interface BaristaCardProps {
    order: Order,
    completeOrder: (o: Order) => void,
}

export const BaristaCard: FC<BaristaCardProps> = (props) => {
    const { order, completeOrder} = props;
    const [open, setOpen] = useState(false)
    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);



    return (
        <>
            <Card
                onClick={handleClick}
                style={{
                    cursor: "pointer",
                    minWidth: "200px",
                    minHeight: "200px",
                }}
            >
                <CardContent style={{ justifyContent: "center" }}>
                    <Typography variant="h5" gutterBottom>
                        {order.OrderId}
                    </Typography>
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent style={{ width: 500 }}>
                    <>
                        <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
                            Information for order {order.OrderId}
                        </DialogContentText>

                    </>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => completeOrder(order)}>Mark order as finished</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BaristaCard
