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
  User,
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
    });
  });
  return {
    orderId: order.OrderId,
    orderItems: displayItems,
    status: order.Status,
    totalPrice: order.TotalPrice,
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
  displayOrder: DisplayOrderItem[]
): Promise<{ checkoutType: checkoutType; item?: string }> {
  const totalCost = displayOrder.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  const funds = await getUserBalance(userId);
  if (roundToTwoDecimals(funds.Balance) < totalCost) {
    return { checkoutType: "InsufficientFunds" };
  }

  const ingredients = await getIngredients();
  const menuItems = await getAllMenuItems();

  let insufficientItem: string | undefined = undefined;

  const drinksInOrder: Drink[] = mapMenuItemsToIngredients(
    menuItems,
    ingredients
  );

  const recipeItems: RecipeItem[] = drinksInOrder.flatMap((drink) => {
    return drink.recipe.map((recipeItem) => {
      return {
        ...recipeItem,
        drinkName: drink.recipe,
      };
    });
  });

  const insufficientStock = recipeItems.some((item) => {
    const ingredient = ingredients.find((ingredient) => {
      return ingredient.IngredientId === item.ingredient.IngredientId;
    });
    if (ingredient === undefined) return true;
    if (
      roundToTwoDecimals(ingredient.Stock ?? 0) <
      roundToTwoDecimals(item.quantity)
    ) {
      insufficientItem = item.ingredient.Name;
      return true;
    }
  });

  if (insufficientStock)
    return { checkoutType: "InsufficientStock", item: insufficientItem };

  return { checkoutType: "Success" };
}

export type checkoutType =
  | "Success"
  | "InsufficientStock"
  | "InsufficientFunds";
