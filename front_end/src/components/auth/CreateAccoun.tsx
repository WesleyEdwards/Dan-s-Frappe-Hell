import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC } from "react";
import * as yup from "yup";
import { formikTextFieldProps } from "../../utils/helperFunctions";

interface CreateAccountProps {
  switchToLogin: () => void;
}

export const CreateAccount: FC<CreateAccountProps> = (props) => {
  const { switchToLogin } = props;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Please enter an email"),
      password: yup
        .string()
        .min(8, "Password should be at least 8 characters")
        .required("Please enter a password"),
      confirmPassword: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      firstName: yup.string().required("Please enter your first name"),
      lastName: yup.string().required("Please enter your last name"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Stack gap="2rem" justifyContent="center">
      <Stack direction="row">
        <IconButton>
          <ArrowBackIcon onClick={switchToLogin} />
        </IconButton>
        <Typography variant="h4" align="center" width="100%" sx={{ mr: 2 }}>
          Create Account
        </Typography>
      </Stack>

      <Stack direction="row" gap="1rem">
        <TextField
          {...formikTextFieldProps(formik, "firstName", "First Name")}
          helperText={formik.touched.firstName && formik.errors.firstName}
          fullWidth
        />
        <TextField
          {...formikTextFieldProps(formik, "lastName", "Last Name")}
          helperText={formik.touched.lastName && formik.errors.lastName}
          fullWidth
        />
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
      <TextField
        {...formikTextFieldProps(formik, "confirmPassword", "Confirm Password")}
        helperText={
          formik.touched.confirmPassword && formik.errors.confirmPassword
        }
        type="password"
      />

      <Stack direction="row" justifyContent="center">
        <Button variant="contained" onClick={formik.submitForm}>
          Create Account
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateAccount;
