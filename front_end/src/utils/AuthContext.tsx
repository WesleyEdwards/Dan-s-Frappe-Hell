import React, {
  useContext,
  createContext,
  useState,
  FC,
  ReactNode,
} from "react";
import { User, loginUser } from "../sdk";

interface Context {
  user: User | null | undefined;
  createAccount: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<string | undefined>;
  logout: () => void;
}

const AuthContext = createContext<Context>({
  user: undefined,
  createAccount: {} as (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>,
  login: {} as (email: string, password: string) => Promise<string | undefined>,
  logout: {} as () => void,
});

export function useAuth() {
  return useContext(AuthContext);
}

type AuthProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProps> = (props) => {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<User | null>();
  //   const [loading, setLoading] = useState(false);

  const createAccount = (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    console.log("createAccount");
    return Promise.resolve();
  };

  const login = (email: string, password: string) => {
    return loginUser(email, password).then((res) => {
      if (res.user !== null && res.user !== undefined) {
        localStorage.setItem("token", res.token);
        setCurrentUser(res.user);
        console.log("login success, ", res.user);
        return "success";
      }
      return undefined;
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.clear();
  };

  const contextValue: Context = {
    user: currentUser,
    createAccount: createAccount,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
