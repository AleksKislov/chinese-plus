import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

interface ContextProps {
  userHsk2Words: OldHskWordType[];
  setUserHsk2Words: Dispatch<SetStateAction<OldHskWordType[]>>;
}

const GlobalContext = createContext<ContextProps>({
  userHsk2Words: [],
  setUserHsk2Words: (): OldHskWordType[] => [],
});

export const HskCtxProvider = ({ children }) => {
  const [userHsk2Words, setUserHsk2Words] = useState<OldHskWordType[]>([]);

  return (
    <GlobalContext.Provider value={{ userHsk2Words, setUserHsk2Words }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useHskCtx = () => useContext(GlobalContext);
