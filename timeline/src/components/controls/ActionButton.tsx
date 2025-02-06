import * as React from "react";
import { useGlobalDialogContext } from "../../../contexts/dialog-context";

interface IActionButtonProps {
  children: React.ReactNode;
  tooltip: string;
  onClick: () => void;
}

export default function ActionButton({
  onClick,
  tooltip,
  children,
}: IActionButtonProps) {
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const { setToolTip } = useGlobalDialogContext();

  return (
    <button
      ref={actionRef}
      onClick={onClick}
      onMouseOver={() =>
        setToolTip({
          description: tooltip,
          element: actionRef.current?.getBoundingClientRect() ?? null,
        })
      }
      onMouseLeave={() => setToolTip({ description: "", element: null })}
      className="relative m-0.5 flex h-6 w-6 items-center justify-center rounded-[4px] p-1 transition-colors duration-200 hover:bg-slate-100"
    >
      {children}
    </button>
  );
}
