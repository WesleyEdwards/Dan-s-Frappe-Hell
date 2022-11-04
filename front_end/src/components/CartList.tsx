import { Divider, List, ListItem, ListItemText } from "@mui/material";
import React, { FC } from "react";
import { DisplayOrder } from "../api/models";

interface CartListProps {
  displayOrder: DisplayOrder;
}

export const CartList: FC<CartListProps> = (props) => {
  const { displayOrder } = props;
  return (
    <List>
      {displayOrder.orderItems.map((item, i) => {
        return (
          <ListItem key={i}>
            <ListItemText
              primary={`${item.quantity} - ${item.drinkName} - $${item.price}`}
            />
          </ListItem>
        );
      })}
      <Divider sx={{ my: "2rem" }} />
      <ListItem>
        <ListItemText primary={`Total: $${displayOrder.totalPrice}`} />
      </ListItem>
    </List>
  );
};

export default CartList;
