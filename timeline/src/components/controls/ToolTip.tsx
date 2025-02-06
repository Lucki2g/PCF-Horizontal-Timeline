import * as React from 'react';
import { motion } from 'framer-motion';
import * as ReactDOM from 'react-dom';

type IToolTipProps = {
  description: string;
  element: DOMRect | null;
};

export default function ToolTip({ description, element }: IToolTipProps) {

  if (!element) return <></>

  console.log(element)

  const dialogElement = (
    <motion.div className="min-w-24 w-24 max-w-24 h-8 shadow-dynamics bg-blue-500 p-2 rounded-[4px] fixed text-[9px] text-white z-50 after:content-[''] text-center 
    after:absolute after:block after:w-0 after:h-0 after:border-solid after:border-t-[6px] after:border-r-[5px] after:border-b-0 after:border-l-[5px] after:border-transparent after:border-t-blue-500 after:-bottom-[6px] after:left-1/2 after:-translate-x-1/2" 
      style={{ left: `${element.left + (element.width / 2) - 48}px`, top: `${element.top - 36}px` }}
      initial={{ backdropFilter: 'blur(0px) brightness(1)', opacity: 0 }}
      animate={{ backdropFilter: 'blur(4px) brightness(.95)', opacity: 1 }}
      exit={{ backdropFilter: 'blur(0px) brightness(1)', opacity: 0 }}
      transition={{ duration: 0.5 }}
  >
    <p>{description}</p>
  </motion.div>
  )

  return ReactDOM.createPortal(dialogElement, document.body);
}