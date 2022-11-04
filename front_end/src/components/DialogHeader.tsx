import {
  Button,
  DialogContentText,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import React, { FC } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface DialogHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  editTitle?: string;
}

export const DialogHeader: FC<DialogHeaderProps> = (props) => {
  const { title, onBack, onEdit, editTitle } = props;
  return (
    <div>
      {(() => {
        if (onBack) {
          return (
            <Stack
              direction="row"
              justifyContent="flex-start"
              gap="2rem"
              paddingBottom="1rem"
            >
              <IconButton>
                <ArrowBackIcon onClick={onBack} />
              </IconButton>
              <DialogContentText variant="h4">{title}</DialogContentText>
            </Stack>
          );
        }
        if (onEdit) {
          return (
            <Stack
              direction="row"
              justifyContent="space-between"
              paddingX="1rem"
              paddingBottom="1rem"
            >
              <DialogContentText variant="h4">{title}</DialogContentText>
              <Button variant="contained" onClick={onEdit}>
                {editTitle ? editTitle : "Edit"}
              </Button>
            </Stack>
          );
        }
        return (
          <Stack direction="row" padding="1rem">
            <DialogContentText variant="h4">{title}</DialogContentText>
          </Stack>
        );
      })()}

      <Divider />
    </div>
  );
};

export default DialogHeader;
