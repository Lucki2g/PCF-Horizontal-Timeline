import * as React from "react";
import * as ReactDOM from "react-dom";

type GlobalDialogProps = {
  element: React.ReactNode;
  size: string | null;
};

export default function GlobalDialog({ element, size }: GlobalDialogProps) {
  const dialogElement = (
    <div className="fixed left-0 top-0 z-[9999] flex h-full min-h-full w-full min-w-full items-center justify-center">
      <div
        className={`min-w-[480px] ${size ? size : "w-[480px]"} min-h-32 rounded-lg bg-white p-4 shadow-dynamics`}
      >
        {element}
      </div>
    </div>
  );

  // Fluent UI Portal element does not work so use React Portal....
  return ReactDOM.createPortal(dialogElement, document.body);
}
