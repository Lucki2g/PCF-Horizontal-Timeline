import * as React from "react";
import { motion } from "framer-motion";
import * as ReactDOM from "react-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

type GlobalDialogProps = {
  element: React.ReactNode;
  size: string | null;
};

export default function GlobalDialog({ element, size }: GlobalDialogProps) {
  const dialogElement = (
    <FluentProvider theme={webLightTheme}>
      <motion.div
        className="fixed left-0 top-0 z-[9999] flex h-full min-h-full w-full min-w-full items-center justify-center"
        initial={{ backdropFilter: "blur(0px) brightness(1)", opacity: 0 }}
        animate={{ backdropFilter: "blur(4px) brightness(.95)", opacity: 1 }}
        exit={{ backdropFilter: "blur(0px) brightness(1)", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`min-w-[480px] ${size ? size : "w-[480px]"} min-h-32 rounded-lg bg-white p-4 shadow-dynamics`}
        >
          {element}
        </div>
      </motion.div>
    </FluentProvider>
  );

  // Fluent UI Portal element does not work so use React Portal....
  return ReactDOM.createPortal(dialogElement, document.body);
}
