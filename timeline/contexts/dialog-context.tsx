import { createContext, useContext, useState, ReactNode } from "react";
import * as React from "react";
import GlobalDialog from "../src/components/Dialog";
import { AnimatePresence } from "framer-motion";
import * as ReactDOM from "react-dom";

// The modal is used for large components. 
// The Dialog is for error, warning, info
type DialogContextProps = {
  showDialog: (element: ReactNode) => void;
  hideDialog: () => void;
  dialogState: ReactNode | null;
};

const initialState: DialogContextProps = {
  showDialog: () => {},
  hideDialog: () => {},
  dialogState: null,
};

const DialogContext = createContext<DialogContextProps>(initialState);

export const useGlobalDialogContext = () => useContext(DialogContext);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ReactNode | null>(null);

  const showDialog = (element: ReactNode) => {
    setState(element);
  };

  const hideDialog = () => {
    setState(null);
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog, dialogState: state }}>
        <AnimatePresence exitBeforeEnter >
            {state && <GlobalDialog element={state} />}
        </AnimatePresence>
      {children}
    </DialogContext.Provider>
  );
};