import { makePostRequest } from "./utils/apiUtils";

export enum Permission {
  NONE = "0",
  CUSTOMER = "1",
  WORKER = "2",
  MANAGER = "3",
  ADMIN = "4",
}
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  permissions: Permission;
  userId: string;
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
