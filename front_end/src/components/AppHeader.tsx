import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC } from "react";
import { RouterTabs } from "./RouterTabs";

export const AppHeader: FC = () => {
  const navigateToLogin = () => {
    console.log("navigate to sign in");
  };
  return (
    <Stack direction="row" justifyContent="right" gap="2rem">
      <RouterTabs />
      <IconButton onClick={navigateToLogin} size="large">
        <AccountCircleIcon fontSize="large" />
      </IconButton>
    </Stack>
  );
};

export default AppHeader;
