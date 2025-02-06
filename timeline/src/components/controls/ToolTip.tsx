import * as React from "react";
import { motion } from "framer-motion";
import * as ReactDOM from "react-dom";

type IToolTipProps = {
  description: string;
  element: DOMRect | null;
};

export default function ToolTip({ description, element }: IToolTipProps) {
  if (!element) return <></>;

  const dialogElement = (
    <motion.div
      className="fixed z-50 h-8 w-24 min-w-24 max-w-24 rounded-[4px] bg-blue-500 p-2 text-center text-[9px] text-white shadow-dynamics after:absolute after:-bottom-[6px] after:left-1/2 after:block after:h-0 after:w-0 after:-translate-x-1/2 after:border-b-0 after:border-l-[5px] after:border-r-[5px] after:border-t-[6px] after:border-solid after:border-transparent after:border-t-blue-500 after:content-['']"
      style={{
        left: `${element.left + element.width / 2 - 48}px`,
        top: `${element.top - 36}px`,
      }}
      initial={{ backdropFilter: "blur(0px) brightness(1)", opacity: 0 }}
      animate={{ backdropFilter: "blur(4px) brightness(.95)", opacity: 1 }}
      exit={{ backdropFilter: "blur(0px) brightness(1)", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p>{description}</p>
    </motion.div>
  );

  return ReactDOM.createPortal(dialogElement, document.body);
}
