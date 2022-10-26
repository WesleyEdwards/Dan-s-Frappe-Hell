import { Card, CardContent, Dialog, Typography } from "@mui/material";
import { FC, useState, useEffect } from "react";
import { Drink, OrderItem } from "../../api/models";
import CustomOrderDrink from "./CustomOrderDrink";
import OrderDrink from "./OrderDrink";

interface DrinkCardProps {
  drink: Drink;
  handleAddToCart: (orderItem: OrderItem) => Promise<unknown>;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink, handleAddToCart } = props;

  const [open, setOpen] = useState(false);
  const [customizeDrink, setCustomizeDrink] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(drink.menuItem.Price);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setQuantity(1);
    setCustomizeDrink(false);
    setOpen(false);
  };

  const handleSubmit = () => {
    // handleAddToCart(modifiedDrink);
    return handleAddToCart({
      menuId: drink.menuItem.MenuId,
      quantity: quantity,
      price: price,
    }).then(handleClose);
  };

  useEffect(() => {
    setPrice(Math.round(drink.menuItem.Price * quantity * 100) / 100);
  }, [drink, quantity]);

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
        <CardContent style={{ justifyContent: "center" }}>
          <Typography variant="h5" gutterBottom>
            {drink.menuItem.Name}
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} fullWidth>
        {customizeDrink ? (
          <CustomOrderDrink
            drink={drink}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            standardDrink={() => setCustomizeDrink(false)}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
          />
        ) : (
          <OrderDrink
            drink={drink}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            customizeDrink={() => setCustomizeDrink(true)}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
          />
        )}
      </Dialog>
    </>
  );
};

export default DrinkCard;
