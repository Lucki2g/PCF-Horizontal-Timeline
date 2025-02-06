import * as React from 'react'
import { useGlobalDialogContext } from '../../../contexts/dialog-context';

interface IActionButtonProps {
    children: React.ReactNode;
    tooltip: string;
    onClick: () => void;
}

export default function ActionButton({ onClick, tooltip, children }: IActionButtonProps) {

    const actionRef = React.useRef<HTMLButtonElement>(null);
    const { setToolTip } = useGlobalDialogContext();

    return (
        <button ref={actionRef} 
            onClick={onClick} 
            onMouseOver={() => setToolTip({ description: tooltip, element: actionRef.current?.getBoundingClientRect() ?? null })} 
            onMouseLeave={() => setToolTip({ description: "", element: null })} 
            className="relative flex justify-center items-center p-1 w-6 h-6 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                {children}
        </button>
    )
}
