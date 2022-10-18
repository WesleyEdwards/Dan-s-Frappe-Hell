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
