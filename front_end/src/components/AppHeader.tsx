import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton, Popover } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouterTabs } from "./RouterTabs";

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
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
        <Button sx={{ p: 2 }} variant="text" onClick={navigateToLogin}>
          Login
        </Button>
      </Popover>
    </Stack>
  );
};

export default AppHeader;
