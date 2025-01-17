import * as React from 'react'

interface ISearchProps {
    label: string;
    value: string;
    description?: string;
    onChange: (value: string) => void;
}

export default function Search({ label, value, description, onChange } : ISearchProps) {
    
    const [focused, setFocused] = React.useState<boolean>(false);

    return (
        <div className='my-2 w-full flex-col'>
            <div className='relative w-full my-1'>
                <input 
                value={value} 
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => onChange(e.target.value)} 
                type='text' 
                tabIndex={1}
                className='w-full box-border border-solid bg-neutral-100 focus:outline-none peer pt-5 p-2 rounded-[4px] text-sm'></input>
                <label className={`text-start font-semibold text-gray-500 tracking-wide duration-150 transition-all absolute left-2 
                peer-focus:text-cyan-400 ${ focused || value.length > 0 ? " text-xs" : "text-sm"}`} style={{ top: focused || value.length > 0 ? "2px" : "14px" }}>{label}</label>
                <div className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-sky-600 transition-all duration-300 transform -translate-x-1/2 peer-focus:w-full peer-focus:transform-origin-center rounded-b-[4px]"></div>
            </div>
            { description ? <p className='text-[8px] text-gray-400'>{description}</p> : <></> }
        </div>
    )
}
