import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Permission } from "../../api/models";
import { useAuth } from "../../utils/AuthContext";
import { hasPermission } from "../../utils/helperFunctions";
import { PrivateRoute } from "../../utils/PrivateRoute";
import CustomerManagement from "../../Views/admin/CustomerManagement";
import EmployeeManagement from "../../Views/admin/EmployeeManagement";
import Inventory from "../../Views/admin/Inventory";
import CashierView from "../../Views/employee/CashierView";
import Home from "../../Views/Home";
import Login from "../../Views/Login";
import Profile from "../../Views/Profile";

export const DFRoutes: FC = () => {
  const { user } = useAuth();

  const unAuthRoutes = [
    {
      path: "/login",
      element: <Login />,
      permissionRequired: undefined,
    },
    {
      path: "/home",
      element: <Home />,
      permissionRequired: undefined,
    },
  ];
  const customerRoutes = [
    ...unAuthRoutes,
    {
      path: "/profile",
      element: <Profile />,
      permissionRequired: Permission.CUSTOMER,
    },
  ];
  const workerRoutes = [
    ...customerRoutes,
    {
      path: "/cashier-view",
      element: <CashierView />,
      permissionRequired: Permission.WORKER,
    },
    {
      path: "/inventory",
      element: <Inventory />,
      permissionRequired: Permission.WORKER,
    },
  ];
  const adminRoutes = [
    ...workerRoutes,
    {
      path: "/customer-management",
      element: <CustomerManagement />,
      permissionRequired: Permission.ADMIN,
    },
    {
      path: "/employee-management",
      element: <EmployeeManagement />,
      permissionRequired: Permission.ADMIN,
    },
  ];
  const userRoutes = (() => {
    if (!user) {
      return unAuthRoutes;
    }
    if (hasPermission(user.permissions, Permission.ADMIN)) {
      return adminRoutes;
    }
    if (hasPermission(user.permissions, Permission.WORKER)) {
      return workerRoutes;
    }
    return customerRoutes;
  })();

  return (
    <Routes>
      {userRoutes.map((route) => (
        <>
          {route.permissionRequired ? (
            <Route
              path={route.path}
              element={
                <PrivateRoute
                  path="/"
                  permissionRequired={route.permissionRequired}
                  element={route.element}
                />
              }
            />
          ) : (
            <Route path={route.path} element={route.element} />
          )}
        </>
      ))}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default DFRoutes;
