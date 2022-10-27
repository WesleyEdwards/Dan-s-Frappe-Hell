import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { hasPermission, useRouteMatch } from "../utils/helperFunctions";
import { useAuth } from "../utils/AuthContext";

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
  const employeeTabs = [
    ...customerTabs,
    {
      label: "Cashier",
      path: "/cashier-view",
    },
    {
      label: "Barista",
      path: "/barista-view",
    },
    {
      label: "Inventory",
      path: "/inventory",
    },
  ];

  const managerTabs = [
    ...employeeTabs,
    {
      label: "Customer Management",
      path: "/customer-management",
    },
    {
      label: "Employee Management",
      path: "/employee-management",
    },
  ];
  const getTabOptions = (() => {
    if (!user) {
      return unAuthTabs;
    }
    if (hasPermission(user.permissions, "Manager")) {
      return managerTabs;
    }
    if (hasPermission(user.permissions, "Employee")) {
      return employeeTabs;
    }
    return customerTabs;
  })();

  return (
    <Tabs value={currentTab ?? "/home"}>
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
