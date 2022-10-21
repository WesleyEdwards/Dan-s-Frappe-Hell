import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC, useEffect } from "react";
import * as yup from "yup";
import {
  formikTextFieldNumberProps,
  formikTextFieldProps,
} from "../utils/helperFunctions";
import { IngredientType } from "../sdk";
import { IngredientRow } from "./IngredientsEdit";

interface EditIngredientDialogueProps {
  ingredient: IngredientRow | undefined;
  handleClose: () => void;
  newIngredient?: boolean;
  submitIngredient: (ingredient: IngredientRow) => void;
}
export const EditIngredientDialogue: FC<EditIngredientDialogueProps> = (
  props
) => {
  const { ingredient, handleClose, newIngredient, submitIngredient } = props;

  const onClose = () => {
    formik.setFieldValue("upCharge", undefined);
    formik.setFieldValue("price", undefined);
    formik.setFieldValue("stock", undefined);
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
      stock: yup.number().required("Required"),
      name: yup.string().required("Required"),
      kind: yup.string().nullable().required("Required"),
    }),
    onSubmit: (values) => {
      if (!ingredient) return;
      submitIngredient({
        id: ingredient.id,
        kind: values.kind ?? IngredientType.ADDIN,
        name: values.name ?? "",
        price: values.price ?? 0,
        upCharge: values.upCharge ?? 0,
        stock: values.stock ?? 0,
      });
    },
  });

  useEffect(() => {
    if (newIngredient) {
      formik.handleReset({ ...ingredient });
    } else {
      if (!ingredient) return;
      formik.setFieldValue("upCharge", ingredient.upCharge);
      formik.setFieldValue("price", ingredient.price);
      formik.setFieldValue("stock", ingredient.stock);
      formik.setFieldValue("name", ingredient.name);
      formik.setFieldValue("kind", ingredient.kind);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredient]);

  if (ingredient === undefined) return <></>;
  return (
    <Dialog open={ingredient !== undefined} onClose={onClose} fullWidth={true}>
      <DialogContent>
        <Stack gap="2rem">
          <DialogContentText variant="h4" style={{ paddingBottom: 40 }}>
            {newIngredient ? "New Ingredient" : ingredient.name}
          </DialogContentText>

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
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!formik.dirty}
          onClick={() => formik.submitForm()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIngredientDialogue;
