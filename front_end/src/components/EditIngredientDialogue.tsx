import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import React, { FC, useEffect } from "react";
import * as yup from "yup";
import {
  formikTextFieldNumberProps,
  formikTextFieldProps,
} from "../utils/helperFunctions";
import { IngredientType } from "../api/models";
import { IngredientRow } from "./IngredientsEdit";
import DialogHeader from "./DialogHeader";

interface EditIngredientDialogueProps {
  ingredient: IngredientRow | undefined;
  handleClose: () => void;
  newIngredient?: boolean;
  submitIngredient: (ingredient: IngredientRow) => void;
  handleBack?: () => void;
}
export const EditIngredientDialogue: FC<EditIngredientDialogueProps> = (
  props
) => {
  const { ingredient, handleClose, submitIngredient, handleBack } = props;

  const onClose = () => {
    formik.setFieldValue("upCharge", undefined);
    formik.setFieldValue("price", undefined);
    formik.setFieldValue("name", undefined);
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      upCharge: ingredient?.upCharge,
      price: ingredient?.price,
      stock: ingredient?.stock,
      name: ingredient?.name,
      kind: ingredient?.kind,
    },
    validationSchema: yup.object({
      upCharge: yup.number().required("Required"),
      price: yup.number().required("Required"),
      name: yup.string().required("Required"),
      kind: yup.string().nullable().required("Required"),
    }),
    onSubmit: (values) => {
      if (!ingredient) return;
      submitIngredient({
        ...ingredient,
        kind: values.kind ?? IngredientType.ADDIN,
        name: values.name ?? "",
        price: values.price ?? 0,
        upCharge: values.upCharge ?? 0,
      });
    },
  });

  useEffect(() => {
    if (!ingredient) return;
    formik.setFieldValue("upCharge", ingredient.upCharge);
    formik.setFieldValue("price", ingredient.price);
    formik.setFieldValue("name", ingredient.name);
    formik.setFieldValue("kind", ingredient.kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredient]);

  if (ingredient === undefined) return <></>;
  return (
    <>
      <DialogContent>
        <Stack gap="2rem">

          <DialogHeader title={ingredient.name} onBack={handleBack} />

          <TextField
            sx={{ flex: 1 }}
            {...formikTextFieldProps(formik, "name", "Name")}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Stack direction="row" gap="1rem">
            <TextField
              sx={{ flex: 1 }}
              {...formikTextFieldNumberProps(formik, "upCharge", "Up Charge")}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ flex: 1 }}
              {...formikTextFieldNumberProps(formik, "price", "Price")}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField value={ingredient.stock} label="Stock" disabled />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!formik.dirty}
          onClick={() => formik.submitForm()}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

export default EditIngredientDialogue;
