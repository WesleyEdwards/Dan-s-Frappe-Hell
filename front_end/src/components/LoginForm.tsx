import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { FC, useState } from "react";

interface LoginFormProps {
  switchToCreateAccount: () => void;
}

export const LoginForm: FC<LoginFormProps> = (props) => {
  const { switchToCreateAccount } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = () => {
    setEmailError("");
    setPasswordError("");
    if (email.length === 0) {
      setEmailError("Please enter an email");
      return;
    }
    if (password.length === 0) {
      setPasswordError("Please enter a password");
      return;
    }

    alert("login not implemented");
  };

  return (
    <Stack gap="2rem" justifyContent="center">
      <Typography variant="h4" align="center">
        Sign In
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        type="password"
      />

      <Stack direction="row" justifyContent="center">
        <Button variant="contained" onClick={login}>
          Login
        </Button>
      </Stack>

      <Stack direction="row" gap="1rem" justifyContent="center">
        <Button variant="text">Forgot Password?</Button>
        <Divider orientation="vertical" flexItem />
        <Button variant="text" onClick={switchToCreateAccount} sx={{ mx: 2 }}>
          Create Account
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginForm;
