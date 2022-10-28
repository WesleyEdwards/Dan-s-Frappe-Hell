import { LoginResponse } from "../api/api-functions";
import { Permission, RawUser, User } from "../api/models";
import { permissionToIntMap } from "./constants";

export function formatRawUser(user: RawUser): User {
  return {
    email: user.email,
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: getPermissionString(user.permissions.toString()),
  };
}

export function formatRawUsers(users: RawUser[]): User[] {
  return users.map((user) => formatRawUser(user));
}

export function stashAndFormatUser(loginRes: LoginResponse): User | null {
  if (!loginRes?.user) return null;

  const formattedUser = formatRawUser(loginRes.user);

  localStorage.setItem("token", loginRes.token);
  localStorage.setItem("userObject", JSON.stringify(formattedUser));

  return formattedUser;
}

export function hasPermission(
  user: User | null | undefined,
  requiredPermission: Permission
): boolean {
  if (!user) return false;
  const perm = getPermissionInt(user.permissions);
  const permRequired = getPermissionInt(requiredPermission);
  return perm >= permRequired;
}

export function isPermissionString(
  permission: string
): permission is Permission {
  return (
    permission === "Customer" ||
    permission === "Employee" ||
    permission === "Manager" ||
    permission === "Admin" ||
    permission === "None"
  );
}

function getPermissionString(permission: string | undefined): Permission {
  if (permission === undefined) return "None";
  if (permission === "0") return "None";
  if (permission === "1") return "Customer";
  if (permission === "2") return "Employee";
  if (permission === "3") return "Manager";
  if (permission === "4") return "Admin";

  return "None";
}

export function getPermissionInt(permission: Permission): number {
  if (!isPermissionString(permission)) return 0;
  return permissionToIntMap[permission];
}
