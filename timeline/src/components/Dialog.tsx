import * as React from 'react';
import { motion } from 'framer-motion';
import * as ReactDOM from 'react-dom';

type GlobalDialogProps = {
  element: React.ReactNode;
  size: string | null;
};

export default function GlobalDialog({ element, size }: GlobalDialogProps) {

  const dialogElement = (
    <motion.div className="w-full h-full min-w-full min-h-full z-[9999] fixed left-0 top-0 flex justify-center items-center"
      initial={{ backdropFilter: 'blur(0px) brightness(1)', opacity: 0 }}
      animate={{ backdropFilter: 'blur(4px) brightness(.95)', opacity: 1 }}
      exit={{ backdropFilter: 'blur(0px) brightness(1)', opacity: 0 }}
      transition={{ duration: 0.5 }}
  >
      <div className={`min-w-[480px] ${size ? size : "w-[480px]"} min-h-32 shadow-dynamics bg-white p-4 rounded-lg`}>
          {element}
      </div>
  </motion.div>
  )

  return ReactDOM.createPortal(dialogElement, document.body);
}