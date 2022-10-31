import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Alert,
  DialogContentText,
  ListItemText,
  ListItem,
  List,
  Divider,
  CardActions,
  DialogTitle,
} from "@mui/material";
import React, { FC, useState } from "react";
import { DisplayOrder } from "../api/models";

interface BaristaCardProps {
  order: DisplayOrder;
  completeOrder: (orderId: number) => Promise<unknown>;
}

export const BaristaCard: FC<BaristaCardProps> = (props) => {
  const { order, completeOrder } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [error, setError] = useState<string | undefined>();

  return (
    <>
      <Card>
        <CardContent>
          <List>
            {order.orderItems.map((item, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`(${item.quantity}) - ${item.drinkName}`}
                />
                <Divider />
                {i <= order.orderItems.length && <Divider />}
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Button onClick={handleClick} variant="contained">
            Complete
          </Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ p: "4rem" }}>Confirm Order Completion</DialogTitle>
        {error && <Alert severity="error">{error}</Alert>}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              completeOrder(order.orderId).catch(() =>
                setError("Error completing order")
              )
            }
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BaristaCard;
