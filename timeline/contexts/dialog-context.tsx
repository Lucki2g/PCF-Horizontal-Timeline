import { createContext, useContext, useState, ReactNode } from "react";
import * as React from "react";
import GlobalDialog from "../src/components/Dialog";

// The modal is used for large components.
// The Dialog is for error, warning, info
type DialogContextProps = {
  showDialog: (element: ReactNode, size: string | null) => void;
  hideDialog: () => void;
  tooltip: { description: string; element: DOMRect | null };
  setToolTip: (data: { description: string; element: DOMRect | null }) => void;
  dialogState: { node: ReactNode | null; size: string | null };
};

const initialState: DialogContextProps = {
  showDialog: () => {},
  hideDialog: () => {},
  tooltip: { description: "", element: null },
  setToolTip: () => {},
  dialogState: { node: null, size: null },
};

const DialogContext = createContext<DialogContextProps>(initialState);

export const useGlobalDialogContext = () => useContext(DialogContext);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    node: ReactNode | null;
    size: string | null;
  }>({ node: null, size: null });
  const [tooltip, setToolTip] = useState<{
    description: string;
    element: DOMRect | null;
  }>({ description: "", element: null });

  const showDialog = (element: ReactNode, size: string | null) => {
    setState({ node: element, size: size });
  };

  const hideDialog = () => {
    setState({ node: null, size: null });
  };

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        hideDialog,
        dialogState: state,
        setToolTip,
        tooltip,
      }}
    >
      {state.node && <GlobalDialog element={state.node} size={state.size} />}
      {tooltip.element}
      {children}
    </DialogContext.Provider>
  );
};
