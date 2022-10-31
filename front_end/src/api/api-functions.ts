import { makePostRequest, makeGetRequest } from "../utils/apiUtils";
import {
  formatRawUsers,
  getPermissionInt,
  stashAndFormatUser,
} from "../utils/userHelperFunctions";
import {
  CreateIngredientType,
  Ingredient,
  IngredientType,
  MenuItem,
  Order,
  OrderStatus,
  Permission,
  RawUser,
  User,
} from "./models";

export interface LoginResponse {
  token: string;
  error: string;
  user: RawUser;
}

export interface NewUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type UpdateOrder = Omit<Order, "UserId" | "TotalPrice" | "OrderDate">;

export function loginUser(
  password: string,
  email: string
): Promise<User | null> {
  return makePostRequest("auth/token", { password, email }).then(
    stashAndFormatUser
  );
}

export function createUser(
  createAccountProps: NewUserProps
): Promise<User | null> {
  return makePostRequest("users/new", { ...createAccountProps }).then((res) =>
    loginUser(createAccountProps.password, res.user.email)
  );
}

export function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  return makeGetRequest(`orders/status/${status}`).then((res) => res.orders);
}

export function createIngredient(
  ingredient: CreateIngredientType
): Promise<Ingredient> {
  return makePostRequest("ingredients/create", ingredient);
}

export function getAllUsers(): Promise<User[]> {
  return makeGetRequest("users/all").then((res) => formatRawUsers(res.users));
}

export function modifyUserPermission(
  userId: string,
  newPerm: Permission
): Promise<User[]> {
  return makePostRequest("users/permissions", {
    userId,
    newPerm: getPermissionInt(newPerm),
  }).then((res) => res.users);
}

export function getIngredients(): Promise<Ingredient[]> {
  return makeGetRequest("ingredients/").then((res) => res.ingredients);
}
export function getMenuItemById(id: string): Promise<MenuItem> {
  return makeGetRequest(`menuitems/${id}`).then((res) => res.menuitem);
}

export function getMenuItems(): Promise<MenuItem[]> {
  return makeGetRequest("menuitems/").then((res) => res.menuitems);
}

export function getIngredientKinds(): Promise<IngredientType[]> {
  return makeGetRequest("ingredients/kind").then((res) => res.kinds);
}

export function getIngredientById(id: string): Promise<Ingredient> {
  return makeGetRequest(`ingredients/${id}`).then((res) => res.ingredient);
}

export function getCartOrder(userId: string): Promise<Order> {
  return makeGetRequest(`orders/user/${userId}/cart`).then((res) => res.order);
}
export function getOrdersByUser(userId: string): Promise<Order[]> {
  return makeGetRequest(`orders/user/${userId}`).then((res) => res.orders);
}

export function updateOrder(order: UpdateOrder): Promise<Order> {
  return makePostRequest("orders/update", order).then((res) => res.order);
}
