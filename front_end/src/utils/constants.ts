import { IngredientType, Permission } from "../api/models";
import { IngredientRow } from "../components/IngredientsEdit";

export const permissionToIntMap: Record<Permission, number> = {
  None: 0,
  Customer: 1,
  Employee: 2,
  Manager: 3,
  Admin: 4,
};

export const emptyIngredientObject: IngredientRow = {
  id: "-1",
  kind: IngredientType.ADDIN,
  name: "",
  price: 0,
  upCharge: 0,
  stock: 0,
};
