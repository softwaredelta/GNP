// (c) Delta Software 2023, rights reserved.

import { createContext, useContext } from "react";

const HashContext = createContext<string>("");

export const useHash = () => {
  const hash = useContext(HashContext);

  return hash;
};

export const HashProvider = HashContext.Provider;
