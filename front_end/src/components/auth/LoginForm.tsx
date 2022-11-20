import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Button,
  Divider,
  Stack,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC, useState } from "react";
import { LoadingButton } from "@mui/lab";

import * as yup from "yup";
import { formikTextFieldProps } from "../../utils/helperFunctions";
import { useAuth } from "../../utils/AuthContext";

interface LoginFormProps {
  switchToCreateAccount: () => void;
  switchToForgotPassword: () => void;
  navigateToHome: () => void;
}

export const LoginForm: FC<LoginFormProps> = (props) => {
  const { switchToCreateAccount, switchToForgotPassword, navigateToHome } =
    props;
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      password: yup.string().required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setError(null);
      login(values.password, values.email)
        .then((user) => {
          if (user) {
            navigateToHome();
          } else {
            setError("Invalid email or password.");
          }
        })
        .then(() => setSubmitting(false));
    },
  });

  return (
    <Stack gap="2rem" justifyContent="center">
      <Stack direction="row">
        <IconButton>
          <ArrowBackIcon onClick={navigateToHome} />
        </IconButton>
        <Typography variant="h4" align="center" width="100%" sx={{ mr: 5 }}>
          Sign In
        </Typography>
      </Stack>
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
        <LoadingButton
          variant="contained"
          onClick={formik.submitForm}
          loading={formik.isSubmitting}
        >
          Login
        </LoadingButton>
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
