import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Popover
} from "@mui/material";
import Badge, {BadgeProps} from "@mui/material/Badge";
import { Stack } from "@mui/system";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouterTabs } from "./RouterTabs";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    setAnchorEl(null);
    navigate("/login");
  };
    const [open, setOpen] = useState(false);
    const handleCartClick = () => {
        setOpen(true);
    };
    const handleCartClose = () => {
        setOpen(false);
    };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <Stack direction="row" justifyContent="right" gap="2rem">
      <RouterTabs />
        <IconButton aria-label="cart" onClick={handleCartClick}>
            <Badge badgeContent={4} color="secondary">
                <ShoppingCartIcon />
            </Badge>
        </IconButton>
        <Dialog open={open} onClose={handleCartClose}>
            <DialogContent>
                <DialogContentText>
                    Your Cart
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCartClose}>Close Cart</Button>
                <Button onClick={handleCartClose}>Checkout</Button>
            </DialogActions>
        </Dialog>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="large">
        <AccountCircleIcon fontSize="large" />
      </IconButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Button sx={{ p: 2 }} variant="text" onClick={navigateToLogin}>
          Sign In
        </Button>
      </Popover>
    </Stack>
  );
};

export default AppHeader;
