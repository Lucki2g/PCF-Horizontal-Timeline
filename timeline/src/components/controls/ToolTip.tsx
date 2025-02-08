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
      className="flex select-none fixed z-50 h-10 w-[96px] min-w-[96px] max-w-[96px] rounded-[4px] leading-[9px] bg-blue-500 p-2 text-center text-[9px] text-white shadow-dynamics after:absolute after:-bottom-[6px] after:left-1/2 after:block after:h-0 after:w-0 after:-translate-x-1/2 after:border-b-0 after:border-l-[5px] after:border-r-[5px] after:border-t-[6px] after:border-solid after:border-transparent after:border-t-blue-500 after:content-['']"
      style={{
        left: `${element.left + element.width / 2 - 96 / 2}px`,
        top: `${element.top - 40}px`,
      }}
      initial={{ backdropFilter: "blur(0px) brightness(1)", opacity: 0 }}
      animate={{ backdropFilter: "blur(4px) brightness(.95)", opacity: 1 }}
      exit={{ backdropFilter: "blur(0px) brightness(1)", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-full truncate flex justify-center items-center">
        {description}
      </div>
    </motion.div>
  );

  return ReactDOM.createPortal(dialogElement, document.body);
}
