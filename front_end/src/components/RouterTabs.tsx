import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { useRouteMatch } from "../utils/helperFunctions";

export const RouterTabs = () => {
  const routeMatch = useRouteMatch(["/home", "/inventory"]);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <Tabs value={currentTab}>
      <Tab label="Home" value="/home" to="/home" component={Link} />
      <Tab
        label="Inventory"
        value="/inventory"
        to="/inventory"
        component={Link}
      />
    </Tabs>
  );
};
