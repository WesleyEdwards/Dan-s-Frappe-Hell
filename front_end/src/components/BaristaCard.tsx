import {
  Button,
  Card,
  CardContent,
  Dialog,
  Alert,
  ListItemText,
  ListItem,
  List,
  Divider,
  CardActions,
  DialogContent,
} from "@mui/material";
import React, { FC, useState } from "react";
import { DisplayOrder } from "../api/models";
import { DFHDialogActions } from "./DFHDialogActions";
import DialogHeader from "./DialogHeader";
import { RecipeDialog } from "./RecipeDialog";

interface BaristaCardProps {
  order: DisplayOrder;
  completeOrder: (orderId: number) => Promise<unknown>;
}

export const BaristaCard: FC<BaristaCardProps> = (props) => {
  const { order, completeOrder } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCompleteOrder = () => {
    setError(undefined);
    completeOrder(order.orderId).catch(() =>
      setError("Error completing order")
    );
  };

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
          <RecipeDialog order={order} />
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogHeader title="Confirm Order Completion" />
        </DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <DFHDialogActions
          handleClose={handleClose}
          handleSubmit={handleCompleteOrder}
          submitText="Complete"
        />
      </Dialog>
    </>
  );
};

export default BaristaCard;
