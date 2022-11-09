import { TextFieldProps } from "@mui/material";
import { FormikValues, useFormik } from "formik";
import { matchPath, useLocation } from "react-router";
import {
  getAllMenuItems,
  getIngredients,
  getUserBalance,
} from "../api/api-functions";
import {
  Ingredient,
  MenuItem,
  RecipeItem,
  Drink,
  Order,
  DisplayOrder,
  DisplayOrderItem,
  MappingOfIngredientToQuantity,
} from "../api/models";

// ================================
// Routing
// ================================

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

// ================================
// Rounding
// ================================

export function roundToTwoDecimals(number: number): number {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

// ================================
// Form Validation
// ================================

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

// ================================
// Mapping Data
// ================================

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
      itemId: item.menuId.toString(),
      menuId: item.menuId,
    });
  });
  return {
    orderId: order.OrderId,
    orderItems: displayItems,
    status: order.Status,
    totalPrice: order.TotalPrice,
    userId: order.UserId,
  };
}

export function createDisplayOrders(
  order: Order[],
  menuItems: MenuItem[]
): DisplayOrder[] {
  return order.map((order) => {
    return createDisplayOrderFromOrder(order, menuItems);
  });
}

export function recipeItemsToRawRecipeItems(
  recipeItem: RecipeItem[]
): MappingOfIngredientToQuantity {
  const rawRecipeItems: MappingOfIngredientToQuantity = {};
  recipeItem.map((item) => {
    return (rawRecipeItems[item.ingredient.IngredientId.toString()] =
      item.quantity);
  });
  return rawRecipeItems;
}

export async function checkStockAndCost(
  userId: string,
  displayOrder: DisplayOrder
): Promise<{ checkoutType: checkoutType; item?: string }> {
  const funds = await getUserBalance(userId);
  if (roundToTwoDecimals(funds.Balance) < displayOrder.totalPrice) {
    return { checkoutType: "InsufficientFunds" };
  }

  const ingredients = await getIngredients();
  const menuItems = await getAllMenuItems();

  const neededIngredients: RecipeItem[] = [];
  displayOrder.orderItems.forEach((drink) => {
    const required = getRequiredOneDrink(drink, menuItems, ingredients);
    required.forEach((item) => {
      const existing = neededIngredients.find(
        (existing) =>
          existing.ingredient.IngredientId === item.ingredient.IngredientId
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        neededIngredients.push(item);
      }
    });
  });

  let insufficientItem: string | undefined = undefined;
  neededIngredients.forEach((item) => {
    if (item.quantity > (item.ingredient.Stock ?? 0)) {
      insufficientItem = item.ingredient.Name;
    }
  });

  if (insufficientItem !== undefined) {
    return { checkoutType: "InsufficientStock", item: insufficientItem };
  }

  return { checkoutType: "Success" };
}

function getRequiredOneDrink(
  drink: DisplayOrderItem,
  menuItems: MenuItem[],
  ingredients: Ingredient[]
): RecipeItem[] {
  const menuItem = menuItems.find((menuItem) => {
    return menuItem.MenuId === drink.menuId;
  });
  if (menuItem === undefined) return [];

  const recipeItems: RecipeItem[] = [];
  Object.entries(menuItem.Recipe).forEach(([ingredientId, quantity]) => {
    const ingredient: Ingredient | undefined = ingredients.find(
      (ingredient) => {
        return ingredient.IngredientId.toString() === ingredientId.toString();
      }
    );
    if (ingredient) {
      const finalQuantity = quantity * drink.quantity;
      recipeItems.push({ ingredient, quantity: finalQuantity });
    }
  });
  return recipeItems;
}

export type checkoutType =
  | "Success"
  | "InsufficientStock"
  | "InsufficientFunds";
