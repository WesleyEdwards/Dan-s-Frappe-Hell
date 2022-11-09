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
  Typography,
  Stack,
  DialogContent,
} from "@mui/material";
import React, { FC, useState } from "react";
import { DisplayPickup } from "../Views/employee/Pickup";
import { DFHDialogActions } from "./DFHDialogActions";
import DialogHeader from "./DialogHeader";

interface PickupCardProps {
  displayPickup: DisplayPickup;
  completeOrder: (orderId: number) => Promise<unknown>;
}

export const PickupCard: FC<PickupCardProps> = (props) => {
  const { displayPickup, completeOrder } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [error, setError] = useState<string | undefined>();

  const { displayOrder, user } = displayPickup;

  const handleCompleteOrder = () => {
    setError(undefined);
    completeOrder(displayOrder.orderId).catch(() =>
      setError("Error completing order")
    );
  };
  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" gap="1rem" alignItems="end">
            <Typography>Order for:</Typography>
            <Typography variant="h5">
              {user?.firstName} {user?.lastName}
            </Typography>
          </Stack>
          <List>
            {displayOrder.orderItems.map((item, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`(${item.quantity}) - ${item.drinkName}`}
                />
                <Divider />
                {i <= displayOrder.orderItems.length && <Divider />}
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Button onClick={handleClick} variant="contained">
            Mark as Picked Up
          </Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <DialogHeader title={"Confirm Order Pickup"} />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DFHDialogActions
          handleClose={handleClose}
          handleSubmit={handleCompleteOrder}
          submitText="Complete"
        />
      </Dialog>
    </>
  );
};

export default PickupCard;
