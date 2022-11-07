import { Button, DialogActions } from "@mui/material";
import React, { FC } from "react";

interface DFHDialogActionsProps {
  handleClose: () => void;
  handleSubmit: () => void;
  submitText?: string;
  disableSubmit?: boolean;
}

export const DFHDialogActions: FC<DFHDialogActionsProps> = (props) => {
  const { handleClose, handleSubmit, disableSubmit, submitText } = props;
  return (
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button
        variant="contained"
        disabled={disableSubmit}
        onClick={handleSubmit}
      >
        {submitText ? submitText : "Save"}
      </Button>
    </DialogActions>
  );
};
