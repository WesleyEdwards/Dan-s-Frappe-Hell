import { makePostRequest, makeGetRequest } from "./utils/apiUtils";
import { IngredientRow } from "./Views/admin/Inventory";

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

export interface LoginResponse {
  token: string;
  error: string;
  user: User;
}

export function loginUser(
  password: string,
  email: string
): Promise<LoginResponse> {
  return makePostRequest("auth/token", { password, email });
}

export function getIngredients(): Promise<Ingredient[]> {
  return makeGetRequest("ingredients/").then((res) => res.ingredients);
}

export function getIngredientKinds(): Promise<IngredientType[]> {
  return makeGetRequest("ingredients/kind").then((res) => res.kinds);
}

export function createIngredient(
  ingredient: IngredientRow
): Promise<Ingredient> {
  return makePostRequest("ingredients/create", {
    Kind: ingredient.kind,
    Name: ingredient.name,
    Price: ingredient.price,
    Stock: ingredient.stock,
    Upcharge: ingredient.upCharge,
  });
}
