import { Typography } from "@mui/material";
import React, { FC } from "react";

interface DFHeaderProps {
  title: string;
  paddingBottom?: boolean;
}

export const DFHeader: FC<DFHeaderProps> = (props) => {
  const { title, paddingBottom } = props;
  return (
    <>
      {paddingBottom ? (
        <Typography variant="h4" paddingTop="4rem" paddingBottom="8rem">
          {title}
        </Typography>
      ) : (
        <Typography variant="h4" paddingTop="4rem">
          {title}
        </Typography>
      )}
    </>
  );
};
