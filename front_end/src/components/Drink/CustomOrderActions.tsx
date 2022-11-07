import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { roundToTwoDecimals } from "../../utils/helperFunctions";
import { DFHDialogActions } from "../DFHDialogActions";

interface CustomOrderActionsProps {
  error: string | undefined;
  handleSubmitOrder: () => void;
  handleClose: () => void;
  price: number;
  setPrice: (price: number) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export const CustomOrderActions: FC<CustomOrderActionsProps> = (props) => {
  const {
    error,
    handleSubmitOrder,
    handleClose,
    price,
    setPrice,
    quantity,
    setQuantity,
  } = props;

  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateToLogin = () => navigate("/login");

  const changeQuantity = (newQuantity: number) => {
    const pricePerDrink = price / quantity;
    setPrice(roundToTwoDecimals(pricePerDrink * newQuantity));
    setQuantity(newQuantity);
  };
  return (
    <>
      <Stack
        direction="row"
        gap="4rem"
        justifyContent="left"
        marginTop="2rem"
        alignItems="center"
      >
        <FormControl sx={{ width: "8rem" }}>
          <InputLabel>Quantity</InputLabel>
          <Select
            value={quantity.toString()}
            label={"Quantity"}
            onChange={(e) => changeQuantity(parseInt(e.target.value) ?? 1)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h5">{`$${price}`}</Typography>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}

      <DFHDialogActions
        handleClose={handleClose}
        handleSubmit={user ? handleSubmitOrder : navigateToLogin}
        submitText={user ? "Add to Cart" : "Login to Order"}
      />
    </>
  );
};
