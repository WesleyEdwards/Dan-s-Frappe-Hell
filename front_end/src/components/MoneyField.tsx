import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import React, { FC } from "react";

interface MoneyFieldProps {
  title: string;
  value: number;
  onChange: (newValue: number) => void;
  float?: boolean;
}

export const MoneyField: FC<MoneyFieldProps> = (props) => {
  const { value, onChange, title, float = false } = props;
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      gap="2rem"
      alignItems="center"
    >
      <Typography>{title}:</Typography>
      <TextField
        value={value}
        type="number"
        onChange={(e) =>
          float
            ? onChange(parseFloat(e.target.value))
            : onChange(parseInt(e.target.value))
        }
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    </Stack>
  );
};

export default MoneyField;
