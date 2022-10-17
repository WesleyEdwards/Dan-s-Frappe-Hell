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
import { FC, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState} from "react";

interface DrinkCardProps {
  drink: string;
  description: string;
  ingredients: any;
}

export const DrinkCard: FC<DrinkCardProps> = (props) => {
  const {drink, description, ingredients} = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = () => {
    handleClose()
  };

  const [ingredient, setIngredient] = useState('1');
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
            <Typography variant="subtitle1">{description}</Typography>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent style={{width: 500}}>
            <DialogContentText variant="h4" style={{paddingBottom: 40}}>Customize your {drink}</DialogContentText>
            {ingredients.map((i: { Name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) => {
              let v = "1"
              let l = "1"
              const handleChange = (event: SelectChangeEvent) => {
                v = event.target.value as string;
                l = event.target.value as string;
              }
              return(
                <FormControl style={{width: 400, paddingBottom:35}} >
                  <InputLabel style={{paddingBottom: 20}}>{i.Name}</InputLabel>
                  <Select
                      value={v}
                      label={l}
                      onChange={handleChange}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
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
