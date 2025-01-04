import { createContext, useContext, useState, ReactNode } from "react";
import * as React from "react";

type LoaderContextProps = {
  setState: (state: boolean) => void;
  loadingstate: boolean;
};

const initialState: LoaderContextProps = {
  setState: () => {},
  loadingstate: true,
};

const LoaderContext = createContext<LoaderContextProps>(initialState);

export const useGlobalLoaderContext = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<boolean>(initialState.loadingstate);

  return (
    <LoaderContext.Provider value={{ setState, loadingstate: state }}>
      {children}
    </LoaderContext.Provider>
  );
};