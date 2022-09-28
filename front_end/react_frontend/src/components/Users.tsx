import { Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";

interface UsersProps {
  users: string[];
  title?: string;
}

export const Users: FC<UsersProps> = (props) => {
  const { users, title } = props;

  return (
    <>
      <Typography>List of users:</Typography>
      <Typography>The first user is {users[0]}</Typography>
    </>
  );
};
