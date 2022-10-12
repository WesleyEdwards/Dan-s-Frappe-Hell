import { makePostRequest } from "./utils/apiUtils";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  permissions: string;
  userId: string;
}

export interface LoginResponse {
  token: string;
  error: string;
  user: User;
}

export function login(password: string, email: string): Promise<LoginResponse> {
  return makePostRequest("auth/token", { password, email });
}
