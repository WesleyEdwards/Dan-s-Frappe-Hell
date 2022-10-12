import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";

interface DrinkCardProps {
  drink: string;
  addDrink: (newDrink: string) => void;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink, addDrink } = props;
  const [open, setOpen] = useState(false);
  const [newDrink, setNewDrink] = useState("");

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setNewDrink("");
    setOpen(false);
  };

  const handleAddNewDrink = () => {
    handleClose()
    addDrink(newDrink);
  };

  return (
    <>
      <Card
        onClick={handleClick}
        style={{
          cursor: "pointer",
        }}
      >
        <CardContent>
          <Typography>{drink}</Typography>
        </CardContent>
      </Card>

        <DialogTitle>{drink}</DialogTitle>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Customize your drink here.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="My new drink"
            type="email"
            fullWidth
            variant="standard"
            value={newDrink}
            onChange={(e) => setNewDrink(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNewDrink}>Add New Drink</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
