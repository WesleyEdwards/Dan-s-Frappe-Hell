export enum IngredientType {
  MILK = "MILK",
  FLAVOR = "FLAVOR",
  TOPPING = "TOPPING",
  SWEETENER = "SWEETENER",
  ADDIN = "ADDIN",
  COFFEE = "COFFEE",
  SHOT = "SHOT",
}

export interface RawUser {
  email: string;
  firstName: string;
  lastName: string;
  permissions: 0 | 1 | 2 | 3 | 4;
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

export interface RecipeItem {
  ingredient: Ingredient;
  quantity: number;
}

export interface MenuItem {
  MenuId: number;
  Name: string;
  Recipe: MappingOfIngredientToQuantity;
  Price: number;
  Active: boolean;
  ImagePath: string;
}

export interface OrderItem {
  menuId: number;
  quantity: number;
  price: number;
}

export interface Order {
  OrderId: number;
  UserId: number;
  Favorite: boolean;
  Items: OrderItem[];
  OrderDate: number;
  Status: OrderStatus;
  TotalPrice: number;
}

// These Models are not used by the API.
// They are for the convenience of the front end.

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  permissions: Permission;
  userId: string;
}
export interface Drink {
  menuItem: MenuItem;
  recipe: RecipeItem[];
}

export interface MappingOfIngredientToQuantity {
  [ingredientId: string]: number;
}

export interface DisplayOrderItem {
  drinkName: string;
  quantity: number;
  price: number;
  itemId: string;
}
export interface DisplayOrder {
  orderId: number;
  orderItems: DisplayOrderItem[];
  status: OrderStatus;
  totalPrice: number;
}

export type CreateIngredientType = Omit<Ingredient, "IngredientId">;
export type OrderStatus = "CART" | "PLACED" | "FINISHED" | "FULFILLED";
export type Permission = "None" | "Customer" | "Employee" | "Manager" | "Admin";
