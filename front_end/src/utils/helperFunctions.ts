import { TextFieldProps } from "@mui/material";
import { FormikValues, useFormik } from "formik";
import { matchPath, useLocation } from "react-router";
import { PermissionString } from "../api/api-functions";
import {
  Ingredient,
  MenuItem,
  RecipeItem,
  Drink,
  Order,
  DisplayOrder,
  DisplayOrderItem,
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
  userPermission: PermissionString,
  requiredPermission: PermissionString
): boolean {
  const none = 0;
  const customer = 1;
  const employee = 2;
  const manager = 3;
  const admin = 4;
  const permissionMap: Record<PermissionString, number> = {
    None: none,
    Customer: customer,
    Employee: employee,
    Manager: manager,
    Admin: admin,
  };

  return permissionMap[userPermission] >= permissionMap[requiredPermission];
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
): permission is PermissionString {
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
): PermissionString {
  if (!permission) return "None";

  if (isPermissionString(permission)) {
    return permission;
  }
  return "None";
}

export function formatRawUser(user: RawUser): User {
  return {
    UserId: user.UserId,
    Username: user.Username,
    FirstName: user.FirstName,
    LastName: user.LastName,
    Email: user.Email,
    Permission: getPermissionString(user.Permission),
  };
}
