import {
  Alert,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC, useState } from "react";
import * as yup from "yup";
import { formikTextFieldProps } from "../../utils/helperFunctions";
import { User, login } from "../../sdk";
interface LoginFormProps {
  switchToCreateAccount: () => void;
  switchToForgotPassword: () => void;
}

export const LoginForm: FC<LoginFormProps> = (props) => {
  const { switchToCreateAccount, switchToForgotPassword } = props;
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (token: string, user: User) => {
    localStorage.setItem("token", token);
    alert(
      `Welcome ${user.firstName} ${user.lastName}. You have successfully Logged in.`
    );
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      password: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setError(null);
      login(values.password, values.email).then((data) => {
        console.log(data);
        data.token && handleLoginSuccess(data.token, data.user);
        data.error && setError(data.error);
      });
    },
  });

  return (
    <Stack gap="2rem" justifyContent="center">
      <Typography variant="h4" align="center">
        Sign In
      </Typography>
      <TextField
        {...formikTextFieldProps(formik, "email", "Email")}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        {...formikTextFieldProps(formik, "password", "Password")}
        helperText={formik.touched.password && formik.errors.password}
        type="password"
      />

      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" justifyContent="center">
        <Button variant="contained" onClick={formik.submitForm}>
          Login
        </Button>
      </Stack>

      <Stack direction="row" gap="1rem" justifyContent="center">
        <Button variant="text" onClick={switchToForgotPassword}>
          Forgot Password?
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button variant="text" onClick={switchToCreateAccount} sx={{ mx: 2 }}>
          Create Account
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginForm;
