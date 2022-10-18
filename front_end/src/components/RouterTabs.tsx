import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { hasPermission, useRouteMatch } from "../utils/helperFunctions";
import { useAuth } from "../utils/AuthContext";
import { Permission } from "../sdk";

export const RouterTabs = () => {
  const routeMatch = useRouteMatch(["/home", "/inventory", "/profile"]);
  const currentTab = routeMatch?.pattern?.path;
  const { user } = useAuth();
  return (
    <Tabs value={currentTab}>
      <Tab label="Home" value="/home" to="/home" component={Link} />
      {user && hasPermission(user.permissions, Permission.ADMIN) && (
        <Tab
          label="Inventory"
          value="/inventory"
          to="/inventory"
          component={Link}
        />
      )}
      {user && hasPermission(user.permissions, Permission.CUSTOMER) && (
        <Tab label="Profile" value="/profile" to="/profile" component={Link} />
      )}
    </Tabs>
  );
};
