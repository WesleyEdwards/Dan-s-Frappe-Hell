import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { FC } from "react";
import { DisplayOrder, DisplayOrderItem } from "../api/models";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartListProps {
  displayOrder: DisplayOrder;
  handleDelete?: (deleteItem: DisplayOrderItem) => void;
}

export const CartList: FC<CartListProps> = (props) => {
  const { displayOrder, handleDelete } = props;
  return (
    <List>
      {displayOrder.orderItems.map((item, i) => {
        return (
          <>
            <ListItem key={i}>
              {handleDelete && (
                <IconButton
                  sx={{ mr: "2rem" }}
                  onClick={() => handleDelete(item)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
              <ListItemText
                primary={`${item.quantity} - ${item.drinkName} - $${item.price}`}
              />
            </ListItem>
          </>
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
