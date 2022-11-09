import {Card, CardContent, CardMedia, Dialog, Typography} from "@mui/material";
import { FC, useState } from "react";
import { Drink, OrderItem } from "../../api/models";
import CustomOrderDrink from "./CustomOrderDrink";

interface DrinkCardProps {
  drink: Drink;
  handleAddToCart: (orderItem: OrderItem) => Promise<unknown>;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink, handleAddToCart } = props;

  const [open, setOpen] = useState(false);
  const [customizeDrink, setCustomizeDrink] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setCustomizeDrink(false);
    setOpen(false);
  };

  const handleSubmit = (menuId: number, quantity: number, price: number) => {
    return handleAddToCart({
      menuId: menuId,
      quantity: quantity,
      price: price,
    }).then(handleClose);
  };

  return (
    <>
      <Card
        onClick={handleOpen}
        style={{
          cursor: "pointer",
          minWidth: "200px",
          minHeight: "200px",
        }}
      >
          <CardMedia
              component="img"
              height="280"
              image={drink.menuItem.ImagePath}
              alt="Drink Image"
          />
        <CardContent style={{ justifyContent: "center" }}>
          <Typography variant="h5" gutterBottom>
            {drink.menuItem.Name}
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <CustomOrderDrink
          customizeDrink={customizeDrink}
          drink={drink}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          setCustomDrink={setCustomizeDrink}
        />
      </Dialog>
    </>
  );
};

export default DrinkCard;
