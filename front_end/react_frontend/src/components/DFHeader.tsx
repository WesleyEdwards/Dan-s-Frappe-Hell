import { Typography } from "@mui/material";
import React, { FC } from "react";

interface DFHeaderProps {
  title: string;
}

export const DFHeader: FC<DFHeaderProps> = (props) => {
  const { title } = props;
  return (
    <Typography variant="h1" padding="4rem">
      {title}
    </Typography>
  );
};
