import { Button, DialogActions } from "@mui/material";
import React, { FC } from "react";

interface DFHDialogActionsProps {
  handleClose: () => void;
  handleSubmit?: () => void;
  submitText?: string;
  disableSubmit?: boolean;
  showSubmit?: boolean;
}

export const DFHDialogActions: FC<DFHDialogActionsProps> = (props) => {
  const {
    handleClose,
    handleSubmit,
    disableSubmit,
    submitText,
    showSubmit = true,
  } = props;
  return (
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      {handleSubmit && showSubmit && (
        <Button
          variant="contained"
          disabled={disableSubmit}
          onClick={handleSubmit}
        >
          {submitText ? submitText : "Save"}
        </Button>
      )}
    </DialogActions>
  );
};
