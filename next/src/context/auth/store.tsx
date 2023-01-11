"use client";

import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

export const NullUser: UserType = {
  id: "",
  name: "unknown",
  avatar: "",
  role: "unknown",
};

interface ContextProps {
  // token: string;
  // setToken: Dispatch<SetStateAction<string>>;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
}

const GlobalContext = createContext<ContextProps>({
  // token: "",
  // setToken: (): string => "",
  loggedIn: false,
  setLoggedIn: (): boolean => false,
  user: NullUser,
  setUser: (): UserType => NullUser,
});

export const AuthCtxProvider = ({ children }) => {
  // const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType>(NullUser);

  return (
    <GlobalContext.Provider value={{ loggedIn, user, setLoggedIn, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useAuthCtx = () => useContext(GlobalContext);
