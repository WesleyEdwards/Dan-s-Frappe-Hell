import React, {
  useContext,
  createContext,
  useState,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { createUser, loginUser, NewUserProps } from "../api/api-functions";
import { User } from "../api/models";

interface Context {
  user: User | null | undefined;
  createAccount: (newUserProps: NewUserProps) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<Context>({
  user: undefined,
  createAccount: {} as (newUserProps: NewUserProps) => Promise<User | null>,
  login: {} as (email: string, password: string) => Promise<User | null>,
  logout: {} as () => void,
  refreshUser: {} as () => void,
});

export function useAuth() {
  return useContext(AuthContext);
}

type AuthProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProps> = (props) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  //   const [loading, setLoading] = useState(false);

  const createAccount = (newUserProps: NewUserProps) => {
    return createUser(newUserProps);
  };

  const login = (email: string, password: string) => {
    return loginUser(email, password).then((user) => {
      setUser(user);
      return user;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };
  const refreshUser = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  useEffect(() => {
    setUser(undefined);
    if (localStorage.getItem("userObject")) {
      setUser(JSON.parse(localStorage.getItem("userObject") || ""));
    }
  }, [refreshTrigger]);

  const contextValue: Context = {
    user,
    login,
    logout,
    createAccount,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
