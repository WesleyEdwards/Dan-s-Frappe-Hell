import React, { FC } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack, Typography } from "@mui/material";

interface ForgotPasswordFormProps {
  switchToLogin: () => void;
}

export const ForgotPassword: FC<ForgotPasswordFormProps> = (props) => {
  const { switchToLogin } = props;
  return (
    <Stack gap="2rem" justifyContent="center">
      <Stack direction="row">
        <IconButton>
          <ArrowBackIcon onClick={switchToLogin} />
        </IconButton>
        <Typography variant="h4" align="center" width="100%" sx={{ mr: 2 }}>
          Forgot Password
        </Typography>
      </Stack>
      <Typography variant="body1" align="center" sx={{ py: 8 }}>
        Reset Password has not been implemented yet.
      </Typography>
    </Stack>
  );
};
