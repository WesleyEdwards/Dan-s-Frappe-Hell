import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { MenuItem, RecipeItem } from "../sdk";
import { IngredientSelect } from "./IngredientSelect";

interface DrinkCardProps {
  menuitem: MenuItem;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { menuitem } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = () => {
    handleClose();
  };

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
            {menuitem.Name}
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ width: 500 }}>
          <>
            <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
              Customize your {menuitem.Name}
            </DialogContentText>
            {Object.entries(menuitem.Recipe).map(([id, amount]) => {
              return (
                <FormControl style={{ width: 400, paddingBottom: 35 }} error>
                  <IngredientSelect
                      id={id}
                      amount = {amount}
                  />
                </FormControl>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddToCart}>Add To Cart</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
