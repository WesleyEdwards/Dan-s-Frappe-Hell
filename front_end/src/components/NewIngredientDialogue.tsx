import {
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC } from "react";
import * as yup from "yup";
import {
  formikTextFieldNumberProps,
  formikTextFieldProps,
} from "../utils/helperFunctions";
import { IngredientType } from "../api/models";
import { IngredientRow } from "./IngredientsEdit";
import DialogHeader from "./DialogHeader";
import { DFHDialogActions } from "./DFHDialogActions";

interface NewIngredientDialogueProps {
  handleClose: () => void;
  newIngredient?: boolean;
  submitIngredient: (ingredient: IngredientRow) => void;
}
export const NewIngredientDialogue: FC<NewIngredientDialogueProps> = (
  props
) => {
  const { handleClose, newIngredient, submitIngredient } = props;

  const onClose = () => {
    formik.setFieldValue("upCharge", undefined);
    formik.setFieldValue("price", undefined);
    formik.setFieldValue("stock", undefined);
    formik.setFieldValue("name", undefined);
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      upCharge: 0,
      price: 0,
      stock: 0,
      name: "",
      kind: IngredientType.ADDIN,
    },
    validationSchema: yup.object({
      upCharge: yup.number().required("Required"),
      price: yup.number().required("Required"),
      stock: yup.number().required("Required"),
      name: yup.string().required("Required"),
      kind: yup.string().nullable().required("Required"),
    }),
    onSubmit: (values) => {
      submitIngredient({
        id: "-1",
        kind: values.kind ?? IngredientType.ADDIN,
        name: values.name ?? "",
        price: values.price ?? 0,
        upCharge: values.upCharge ?? 0,
        stock: values.stock ?? 0,
      });
    },
  });

  return (
    <>
      <DialogContent>
        <Stack gap="2rem">
          <DialogHeader title="New Ingredient" />

          <TextField
            {...formikTextFieldProps(formik, "name", "Name")}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            sx={{ flex: 1 }}
            {...formikTextFieldNumberProps(formik, "stock", "Stock")}
            helperText={formik.touched.stock && formik.errors.stock}
          />
          {newIngredient && (
            <FormControl
              error={formik.touched.kind && formik.values.kind === undefined}
            >
              <InputLabel style={{ paddingBottom: 20 }}>Kind</InputLabel>
              <Select
                value={formik.values.kind}
                label={"Kind"}
                onChange={(e) => {
                  formik.setFieldValue("kind", e.target.value);
                }}
              >
                {Object.values(IngredientType).map((kind) => (
                  <MenuItem key={kind} value={kind}>
                    {kind}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
          </Stack>
        </Stack>
      </DialogContent>

      <DFHDialogActions
        handleClose={onClose}
        handleSubmit={() => formik.submitForm()}
        disableSubmit={!formik.dirty}
      />
    </>
  );
};

export default NewIngredientDialogue;
