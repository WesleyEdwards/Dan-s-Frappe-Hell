import { FC, ReactNode } from "react";
import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { Permission } from "../sdk";
import { useAuth } from "./AuthContext";
import { hasPermission } from "./helperFunctions";

interface PrivateRouteProps {
  path: string;
  element: ReactNode;
  permissionRequired: Permission;
}

export const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  const { user } = useAuth();
  const { path, element, permissionRequired } = props;

  const routeProps: RouteProps = (() => {
    if (user && hasPermission(user.permissions, permissionRequired))
      return { path: path, element: element };
    return { path: "/", element: <Navigate to="/login" /> };
  })();

  return (
    <Routes>
      <Route {...routeProps} />
    </Routes>
  );
};
