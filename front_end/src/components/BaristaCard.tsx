import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import { DisplayOrder, Order } from "../api/models";

interface BaristaCardProps {
  order: DisplayOrder;
  completeOrder: (o: Order) => void;
}

export const BaristaCard: FC<BaristaCardProps> = (props) => {
  const { order, completeOrder } = props;
  const [open, setOpen] = useState(false);
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
          {order.orderItems.map((item, i) => (
            <Typography key={i} variant="h5" gutterBottom>
              {item.drinkName}
            </Typography>
          ))}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ width: 500 }}>
          <>
            <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
              Information for order {order.orderId}
            </DialogContentText>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => completeOrder({} as Order)}
          >
            Mark As Completed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BaristaCard;
