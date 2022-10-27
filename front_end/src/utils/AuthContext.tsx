import React, {
  useContext,
  createContext,
  useState,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { loginUser } from "../api/api-functions";
import { User } from "../api/models";
import { formatRawUser } from "./helperFunctions";

interface Context {
  user: User | null | undefined;
  login: (email: string, password: string) => Promise<string | undefined>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<Context>({
  user: undefined,
  login: {} as (email: string, password: string) => Promise<string | undefined>,
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
  const [user, setCurrentUser] = useState<User | null>();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  function login(
    email: string,
    password: string
  ): Promise<"success" | undefined> {
    return loginUser(email, password).then((res) => {
      if (!res.user) return undefined;
      const formattedUser = formatRawUser(res.user);

      localStorage.setItem("token", res.token);
      localStorage.setItem("userObject", JSON.stringify(formattedUser));

      setCurrentUser(formattedUser);
      return "success";
    });
  }

  const logout = () => {
    setCurrentUser(null);
    localStorage.clear();
  };
  const refreshUser = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  useEffect(() => {
    setCurrentUser(undefined);
    if (localStorage.getItem("userObject")) {
      setCurrentUser(JSON.parse(localStorage.getItem("userObject") || ""));
    }
  }, [refreshTrigger]);

  const contextValue: Context = {
    user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
