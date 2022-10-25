import { makePostRequest, makeGetRequest } from "./utils/apiUtils";

export enum Permission {
  NONE = "0",
  CUSTOMER = "1",
  WORKER = "2",
  MANAGER = "3",
  ADMIN = "4",
}
export enum IngredientType {
  MILK = "MILK",
  FLAVOR = "FLAVOR",
  TOPPING = "TOPPING",
  SWEETENER = "SWEETENER",
  ADDIN = "ADDIN",
  COFFEE = "COFFEE",
  SHOT = "SHOT",
}
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  permissions: Permission;
  userId: string;
}

export interface Ingredient {
  IngredientId: string;
  Kind: IngredientType;
  Name: string;
  Price: number | null | undefined;
  Stock: number | null | undefined;
  Upcharge: number;
}

export interface Drink {
  menuItem: MenuItem;
  recipe: RecipeItem[];
}

export interface RecipeItem {
  ingredient: Ingredient;
  quantity: number;
}

export interface MappingOfIngredientToQuantity {
  [ingredientId: string]: number;
}


export interface MenuItem {
  MenuId: number;
  Name: string;
  Recipe: MappingOfIngredientToQuantity;
  Price: number;
  Active: boolean;
  ImagePath: string;
}

export interface Order{
  OrderId: number;
  UserId: number;
  Favorite: boolean;
  Items: OrderItem[];
  OrderDate: number;
  Status: string;
  TotalPrice: number;
}

export interface LoginResponse {
  token: string;
  error: string;
  user: User;
}

export interface OrderItem {
  menuId: number;
  quantity: number;
  price: number;
}

export function loginUser(
  password: string,
  email: string
): Promise<LoginResponse> {
  return makePostRequest("auth/token", { password, email });
}

export function createAccount(
  firstName: string,
  lastName: string,
  password: string,
  email: string
): Promise<unknown> {
  return makePostRequest("users/new", { password, email, firstName, lastName });
}

export function getIngredients(): Promise<Ingredient[]> {
  return makeGetRequest("ingredients/").then((res) => res.ingredients);
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

export function createIngredient(
  ingredient: CreateIngredientType
): Promise<Ingredient> {
  return makePostRequest("ingredients/create", ingredient);
}

export function getCartOrder(userId: string): Promise<Order> {
  return makeGetRequest(`orders/user/${userId}/cart`).then((res) => res.order);
}

export function updateOrder(
    orderId: number,
    items: OrderItem[],
    favorite: boolean,
    status: string
): Promise<unknown> {
  return makePostRequest("orders/update", {orderId, items, favorite, status});
}

export type CreateIngredientType = Omit<Ingredient, "IngredientId">;
