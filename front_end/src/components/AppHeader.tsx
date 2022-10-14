import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton, Popover } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { RouterTabs } from "./RouterTabs";

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navigateToLogin = () => {
    setAnchorEl(null);
    navigate("/login");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/home");
  };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <Stack direction="row" justifyContent="right" gap="2rem">
      <RouterTabs />
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
