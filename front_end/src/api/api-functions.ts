import { makePostRequest, makeGetRequest } from "../utils/apiUtils";
import {
  Ingredient,
  IngredientType,
  LoginResponse,
  MenuItem,
  User,
} from "./models";

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

export function createIngredient(
  ingredient: CreateIngredientType
): Promise<Ingredient> {
  return makePostRequest("ingredients/create", ingredient);
}

export function getAllUsers(): Promise<User[]> {
  return makeGetRequest("users/all").then((res) => {
    return Promise.resolve([]);
  });
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

export type CreateIngredientType = Omit<Ingredient, "IngredientId">;
