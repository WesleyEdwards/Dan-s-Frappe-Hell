import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { hasPermission, useRouteMatch } from "../utils/helperFunctions";
import { useAuth } from "../utils/AuthContext";
import { Permission } from "../api/models";

export const RouterTabs = () => {
  const routeMatch = useRouteMatch([
    "/home",
    "/inventory",
    "/profile",
    "/customer-management",
    "/employee-management",
    "/cashier-view",
    "/barista-view",
  ]);
  const currentTab = routeMatch?.pattern?.path;
  const { user } = useAuth();

  const unAuthTabs = [
    {
      label: "Home",
      path: "/home",
    },
  ];
  const customerTabs = [
    ...unAuthTabs,
    {
      label: "Profile",
      path: "/profile",
    },
  ];
  const workerTabs = [
    {
      label: "Cashier",
      path: "/cashier-view",
    },
    {
      label: "Inventory",
      path: "/inventory",
    },
    {
      label: "Barista",
      path: "/barista-view",
    },
    ...customerTabs,
  ];

  const adminTabs = [
    {
      label: "Customer Management",
      path: "/customer-management",
    },
    {
      label: "Employee Management",
      path: "/employee-management",
    },
    ...workerTabs,
  ];
  const getTabOptions = (() => {
    if (!user) {
      return unAuthTabs;
    }
    if (hasPermission(user.permissions, Permission.ADMIN)) {
      return adminTabs;
    }
    if (hasPermission(user.permissions, Permission.WORKER)) {
      return workerTabs;
    }
    return customerTabs;
  })();

  return (
    <Tabs value={currentTab}>
      {getTabOptions.map((tab) => (
        <Tab
          label={tab.label}
          value={tab.path}
          to={tab.path}
          component={Link}
        />
      ))}
    </Tabs>
  );
};
