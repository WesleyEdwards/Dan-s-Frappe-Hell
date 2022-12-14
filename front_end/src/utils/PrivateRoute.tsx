import { FC, ReactNode } from "react";
import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { Permission } from "../api/models";
import { useAuth } from "./AuthContext";
import { hasPermission } from "./userHelperFunctions";

interface PrivateRouteProps {
  path: string;
  element: ReactNode;
  permissionRequired: Permission;
}

export const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  const { user } = useAuth();
  const { path, element, permissionRequired } = props;

  const routeProps: RouteProps = (() => {
    if (user && hasPermission(user, permissionRequired))
      return { path: path, element: element };
    return { path: "/", element: <Navigate to="/login" /> };
  })();

  return (
    <Routes>
      <Route {...routeProps} />
    </Routes>
  );
};
