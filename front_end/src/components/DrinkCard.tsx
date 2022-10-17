import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";

interface DrinkCardProps {
  drink: string;
  description: string;
  addDrink: (newDrink: string) => void;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const { drink, description, addDrink } = props;

  const [open, setOpen] = useState(false);
  const [newDrink, setNewDrink] = useState("");

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setNewDrink("");
    setOpen(false);
  };

  const[ingredients, setIngredients] = useState(["Ingredient1", "Ingredient2", "Ingredient3","Ingredient4",
  "Ingredient5", "Ingredient6", "Ingredient7", "Ingredient8","Ingredient9","Ingredient10","Ingredient11","Ingredient12"]);

  const handleAddToCart = () => {
    handleClose()
    addDrink(newDrink);
  };

    const [ingredient, setIngredient] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
      setIngredient(event.target.value as string);
    }

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
        <CardContent style={{justifyContent: "center"}}>
          <Typography variant="h5" gutterBottom>{drink}</Typography>
          <Typography variant="subtitle1" >{description}</Typography>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{width: 500}}>
          <DialogContentText variant="h4" style={{paddingBottom: 40}}>Customize your {drink}</DialogContentText>
          {/*<TextField*/}
          {/*  autoFocus*/}
          {/*  margin="dense"*/}
          {/*  label="My new drink"*/}
          {/*  type="email"*/}
          {/*  fullWidth*/}
          {/*  variant="standard"*/}
          {/*  value={newDrink}*/}
          {/*  onChange={(e) => setNewDrink(e.target.value)}*/}
          {/*/>*/}
            {ingredients.map((i) => {
              return(
                <FormControl style={{width: 400, paddingBottom:35}} >
                  <InputLabel>{i}</InputLabel>
                  <Select
                      value={ingredient}
                      label={i}
                      onChange={handleChange}
                  >
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
              )})}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddToCart}>Add To Cart</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
