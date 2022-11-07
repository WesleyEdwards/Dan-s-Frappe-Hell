import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Permission } from "../../api/models";
import { useAuth } from "../../utils/AuthContext";
import { hasPermission } from "../../utils/userHelperFunctions";
import { PrivateRoute } from "../../utils/PrivateRoute";
import CustomerManagement from "../../Views/admin/CustomerManagement";
import EmployeeManagement from "../../Views/admin/EmployeeManagement";
import EmployeePayroll from "../../Views/admin/EmployeePayroll";
import Inventory from "../../Views/admin/Inventory";
import BaristaView from "../../Views/employee/BaristaView";
import CashierView from "../../Views/employee/CashierView";
import Home from "../../Views/Home";
import Login from "../../Views/Login";
import Profile from "../../Views/Profile";

interface RouteOption {
  path: string;
  element: JSX.Element;
  permission: Permission | undefined;
}

export const DFRoutes: FC = () => {
  const { user } = useAuth();

  const unAuthRoutes: RouteOption[] = [
    {
      path: "/login",
      element: <Login />,
      permission: undefined,
    },
    {
      path: "/home",
      element: <Home />,
      permission: undefined,
    },
  ];
  const customerRoutes: RouteOption[] = [
    ...unAuthRoutes,
    {
      path: "/profile",
      element: <Profile />,
      permission: "Customer",
    },
  ];
  const workerRoutes: RouteOption[] = [
    ...customerRoutes,
    {
      path: "/cashier-view",
      element: <CashierView />,
      permission: "Employee",
    },
    {
      path: "/inventory",
      element: <Inventory />,
      permission: "Employee",
    },
    {
      path: "/barista-view",
      element: <BaristaView />,
      permission: "Employee",
    },
  ];
  const adminRoutes: RouteOption[] = [
    ...workerRoutes,
    {
      path: "/customer-management",
      element: <CustomerManagement />,
      permission: "Manager",
    },
    {
      path: "/employee-management",
      element: <EmployeeManagement />,
      permission: "Manager",
    },
    {
      path:"/store-finance",
      element: <EmployeePayroll/>,
      permission: "Manager",
    },
  ];
  const userRoutes = (() => {
    if (!user) {
      return unAuthRoutes;
    }
    if (hasPermission(user, "Manager")) {
      return adminRoutes;
    }
    if (hasPermission(user, "Employee")) {
      return workerRoutes;
    }
    return customerRoutes;
  })();

  return (
    <Routes>
      {userRoutes.map((route, i) => (
        <>
          {route.permission ? (
            <Route
              key={i}
              path={route.path}
              element={
                <PrivateRoute
                  path="/"
                  permissionRequired={"None"}
                  element={route.element}
                />
              }
            />
          ) : (
            <Route key={i} path={route.path} element={route.element} />
          )}
        </>
      ))}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default DFRoutes;
