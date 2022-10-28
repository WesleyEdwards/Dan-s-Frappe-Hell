import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton, Popover } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartOrder } from "../api/api-functions";
import { useAuth } from "../utils/AuthContext";
import { RouterTabs } from "./RouterTabs";
import ViewCart from "./ViewCart";

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigateToLogin = () => {
    setAnchorEl(null);
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigateToLogin();
  };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!user) return;
    getCartOrder(user.userId);
  }, [user]);

  return (
    <Stack direction="row" justifyContent="right" gap="3rem">
      <RouterTabs />

      <ViewCart />

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
        {user ? (
          <Button sx={{ p: 2 }} variant="text" onClick={handleLogout}>
            Sign Out
          </Button>
        ) : (
          <Button sx={{ p: 2 }} variant="text" onClick={navigateToLogin}>
            Sign In
          </Button>
        )}
      </Popover>
    </Stack>
  );
};

export default AppHeader;
