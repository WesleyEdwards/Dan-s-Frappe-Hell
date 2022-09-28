import { Container, Typography } from "@mui/material";
import React, { FC } from "react";
import { Users } from "./Users";

export const LandingPage: FC = () => {
  const users = ["user1", "user2", "user3"];

  return (
    <Container>
      <Typography>Welcome to Dan's Frappe Hell.</Typography>
      <Users users={users} title={"this is the title"} />
    </Container>
  );
};

export default LandingPage;
