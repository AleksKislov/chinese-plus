"use client";
import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

interface ContextProps {
  alerts: AlertProps[];
  setAlerts: Dispatch<SetStateAction<AlertProps[]>>;
}

const GlobalContext = createContext<ContextProps>({
  alerts: [],
  setAlerts: (): AlertProps[] => [],
});

export const AlertCtxProvider = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  return <GlobalContext.Provider value={{ alerts, setAlerts }}>{children}</GlobalContext.Provider>;
};

export const useAlertCtx = () => useContext(GlobalContext);
