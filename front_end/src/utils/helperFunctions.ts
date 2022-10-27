import { TextFieldProps } from "@mui/material";
import { FormikValues, useFormik } from "formik";
import { matchPath, useLocation } from "react-router";
import {
  Ingredient,
  MenuItem,
  RecipeItem,
  Drink,
  Order,
  DisplayOrder,
  DisplayOrderItem,
  Permission,
  RawUser,
  User,
} from "../api/models";

export function useRouteMatch(patterns: string[]) {
  const { pathname } = useLocation();
  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }
  return null;
}

export function formikTextFieldProps<T extends FormikValues>(
  formik: ReturnType<typeof useFormik<T>>,
  field: keyof T,
  label: string
): TextFieldProps {
  return {
    label,
    name: field.toString(),
    value: formik.values[field],
    onChange: formik.handleChange,
    error: formik.touched[field] && !!formik.errors[field],
  };
}

export function formikTextFieldNumberProps<T extends FormikValues>(
  formik: ReturnType<typeof useFormik<T>>,
  field: keyof T,
  label: string
): TextFieldProps {
  return {
    label,
    type: "number",
    name: field.toString(),
    value: formik.values[field],
    onChange: formik.handleChange,
    error: formik.touched[field] && !!formik.errors[field],
  };
}

export function hasPermission(
  userPermission: Permission,
  requiredPermission: Permission
): boolean {
  const perm = getPermissionInt(userPermission);
  const permRequired = getPermissionInt(requiredPermission);
  console.log(perm, permRequired);
  return perm >= permRequired;
}

export function mapMenuItemsToIngredients(
  menuItems: MenuItem[],
  ingredients: Ingredient[]
): Drink[] {
  return menuItems.map((menuItem) => {
    const recipe: RecipeItem[] = [];
    Object.entries(menuItem.Recipe).forEach(([ingredientId, quantity]) => {
      const ingredient: Ingredient | undefined = ingredients.find(
        (ingredient) => {
          return ingredient.IngredientId.toString() === ingredientId.toString();
        }
      );
      if (ingredient) {
        recipe.push({ ingredient, quantity });
      }
    });
    return { menuItem, recipe };
  });
}

export function createDisplayOrderFromOrder(
  order: Order,
  menuItems: MenuItem[]
): DisplayOrder {
  const displayItems: DisplayOrderItem[] = [];
  order.Items.map((item) => {
    const menuItem = menuItems.find((menuItem) => {
      return menuItem.MenuId === item.menuId;
    });
    return displayItems.push({
      drinkName: menuItem?.Name ?? "Error",
      quantity: item.quantity,
      price: item.price,
    });
  });
  return {
    orderId: order.OrderId,
    orderItems: displayItems,
    status: order.Status,
    totalPrice: order.TotalPrice,
  };
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

export function getPermissionString(
  permission: string | undefined
): Permission {
  if (!permission) return "None";
  if (permission === "0") return "None";
  if (permission === "1") return "Customer";
  if (permission === "2") return "Employee";
  if (permission === "3") return "Manager";
  if (permission === "4") return "Admin";

  return "None";
}

export function getPermissionInt(permission: Permission): number {
  if (!isPermissionString(permission)) return 0;
  const permissionToIntMap: Record<Permission, number> = {
    None: 0,
    Customer: 1,
    Employee: 2,
    Manager: 3,
    Admin: 4,
  };
  return permissionToIntMap[permission];
}

export function formatRawUser(user: RawUser): User {
  console.log(user.permissions.toString());
  console.log({
    email: user.email,
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: getPermissionString(user.permissions.toString()),
  });
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
