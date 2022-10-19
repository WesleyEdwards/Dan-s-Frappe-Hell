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
import { IngredientRow } from "../Views/admin/Inventory";
import * as yup from "yup";
import { formikTextFieldNumberProps } from "../utils/helperFunctions";
import { IngredientType } from "../sdk";

interface EditIngredientDialogueProps {
  ingredient: IngredientRow | undefined;
  handleClose: () => void;
  newIngredient?: boolean;
  onSubmitted: (ingredient: IngredientRow) => void;
}
export const EditIngredientDialogue: FC<EditIngredientDialogueProps> = (
  props
) => {
  const { ingredient, handleClose, newIngredient, onSubmitted } = props;

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
      kind: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      onSubmitted({
        id: ingredient?.id ?? "-1",
        kind: values.kind ?? IngredientType.ADDIN,
        name: values.name ?? "Test",
        price: values.price ?? 1,
        upCharge: values.upCharge ?? -1,
        stock: values.stock ?? -5,
      });
      onClose();
    },
  });

  useEffect(() => {
    formik.setFieldValue("upCharge", ingredient?.upCharge);
    formik.setFieldValue("price", ingredient?.price);
    formik.setFieldValue("stock", ingredient?.stock);
    formik.setFieldValue("name", ingredient?.name);
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
            label="Name"
            value={formik.values["name"]}
            onChange={(e) => {
              formik.setFieldValue("name", e.target.value);
            }}
          />
          <TextField
            sx={{ flex: 1 }}
            {...formikTextFieldNumberProps(formik, "stock", "Stock")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {newIngredient && (
            <FormControl error={false}>
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
          onClick={() => formik.handleSubmit()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIngredientDialogue;
