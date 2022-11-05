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
  MappingOfIngredientToQuantity,
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

export interface Balance {
  BalanceId: number;
  UserId: number;
  Balance: number;
}

export interface Employee {
  employeeId: string;
  userId: string;
  payRate: number;
  hireDate: string;
  hoursWorked: number;
}

export type UpdateOrder = Omit<Order, "UserId" | "TotalPrice" | "OrderDate">;

// ================================
// User
// ================================

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
  newPerm: Permission,
  payRate?: number
): Promise<User[]> {
  return makePostRequest("users/permissions", {
    userId,
    newPerm: getPermissionInt(newPerm),
    payRate: payRate ?? 0,
  }).then((res) => res.users);
}

// ================================
// Employee
// ================================

export function getAllEmployees(): Promise<Employee[]> {
  return makeGetRequest("employees/all").then((res) => res.employees);
}

export function getMyEmployee(): Promise<Employee> {
  return makeGetRequest("employee/data").then((res) => res.employee);
}

// ================================
// Balance
// ================================

export function getUserBalance(userId: string): Promise<Balance> {
  return makeGetRequest(`balance/user/${userId}`).then((res) => res.balance);
}
export function getStoreBalance(): Promise<Balance> {
  return makeGetRequest(`balance/store`).then((res) => res.balance);
}

export function setHoursWorked(hoursWorked: number): Promise<unknown> {
  return makePostRequest("employee/logHours", { hours: hoursWorked });
}

export function incrementUserBalance(
  balanceId: number,
  amount: number
): Promise<number> {
  return makeGetRequest(`balance/${balanceId}/increment/${amount}`).then(
    (res) => res.balance.CurrentBalance
  );
}

// ================================
// Ingredients
// ================================

export function getIngredients(): Promise<Ingredient[]> {
  return makeGetRequest("ingredients/").then((res) => res.ingredients);
}

export function editIngredient(ingredient: Ingredient): Promise<Ingredient> {
  return makePostRequest("ingredients/update", ingredient);
}

export function getIngredientKinds(): Promise<IngredientType[]> {
  return makeGetRequest("ingredients/kind").then((res) => res.kinds);
}

export function getIngredientById(id: string): Promise<Ingredient> {
  return makeGetRequest(`ingredients/${id}`).then((res) => res.ingredient);
}
// ================================
// Menu Items
// ================================

export function getAllMenuItems(): Promise<MenuItem[]> {
  return makeGetRequest("menuitems/").then((res) => res.menuitems);
}

export function getActiveMenuItems(): Promise<MenuItem[]> {
  return makeGetRequest("menuitems/active").then((res) => res.menuitems);
}

export function createMenuItem(
  recipe: MappingOfIngredientToQuantity
): Promise<MenuItem> {
  return makeGetRequest(`menuitems/recipe/${JSON.stringify(recipe)}`).then(
    (res) => res.menuitem
  );
}

export function getMenuItemById(id: string): Promise<MenuItem> {
  return makeGetRequest(`menuitems/${id}`).then((res) => res.menuitem);
}

// ================================
// Orders
// ================================

export function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  return makeGetRequest(`orders/status/${status}`).then((res) => res.orders);
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
