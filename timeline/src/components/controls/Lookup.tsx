import * as React from 'react'
import { IEntityReference, TimelineItem } from '../TimelineItem';
import { getIcon } from '../../util';
import { Search } from 'lucide-react';

interface ILookupProps {
    options: IEntityReference[];
    currentValue: IEntityReference | null;
    label: string;
    description?: string;
    handleChange: (newValue: IEntityReference | null) => void;
}

export default function Lookup({ options, description, label, currentValue, handleChange }: ILookupProps) {

    const inputRef = React.useRef<HTMLInputElement>(null);

    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [query, setQuery] = React.useState<string>(currentValue?.name ?? "");
    const [focused, setFocused] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!isOpen && query) setQuery("");
    }, [isOpen])

    const selectOption = (option: IEntityReference) => {
      setQuery("");
      handleChange(option);
      setIsOpen((isOpen) => !isOpen);
    };
  
    const toggle = (e: React.MouseEvent<HTMLInputElement, MouseEvent> | MouseEvent) => {
      setIsOpen(e && e.target === inputRef.current);
    }

    const filter = (options: IEntityReference[]) => {
        return options.filter((option: IEntityReference) => {
            return option.name.toLowerCase().includes(query.toLowerCase())
        }).reduce((acc: IEntityReference[], option: IEntityReference) => {
            const exists = acc.some(o => o.id === option.id);
            return exists ? acc : [...acc, option];
        }, [])
    }

    React.useEffect(() => {
      document.addEventListener("click", toggle);
      return () => document.removeEventListener("click", toggle);
    }, []);

    const getInput = (): string => {
        if (query) return query;
        if (currentValue) return currentValue.name;
        return "";
    }

    return (
        <div className='my-2 w-full flex-col'>
            <div className='relative w-full'>
                <input 
                ref={inputRef}
                value={getInput()} 
                onChange={(e) => { setQuery(e.target.value); handleChange(null) }} 
                onClick={toggle}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                type='text' 
                tabIndex={1}
                className='peer w-full box-border bg-neutral-100 focus:outline-none pt-5 p-2 rounded-[4px]'></input>
                
                <div className='flex items-center absolute left-2 transition-[top]' style={{ top: focused || getInput().length > 0 ? "2px" : "14px" }}>
                    <span className='w-5 h-5 p-1'>
                        <Search size={48} strokeWidth={1.5} absoluteStrokeWidth />
                    </span>
                    <label className={`text-start font-semibold tracking-wide duration-150 transition-all 
                       ${focused ? "text-cyan-400" : "text-gray-500"} ${ focused || getInput().length > 0 ? "text-xs" : "text-sm"}`}>{label}</label>
                </div>
                
                { description ? <p className='text-[8px] text-gray-400'>{description}</p> : <></> }
                {/* DROP DOWN */}
                <div className={`${isOpen ? "max-h-32 h-auto p-2 shadow-dynamics overflow-y-auto" : "h-0 p-0"} flex flex-col w-full absolute top-14 z-50 rounded-[4px] bg-white transition-all duration-150`}>
                    {
                        isOpen ? filter(options)
                        .map((user) => {
                            return (
                                <button key={`filter-${user.id}`} className='w-full flex items-center rounded-[4px] p-1 hover:bg-gray-50 transition-all duration-150'
                                    onClick={() => selectOption(user)}>
                                    <span className='w-4 h-4 mr-2'>
                                        {getIcon(user.entitytype)}
                                    </span>
                                    <div className='flex flex-col text-start'>
                                        <p className='semibold text-dynamics-text text-sm truncate'>{user.name}</p>
                                        <p className='text-xs text-gray-400 truncate'>{user.entitytype}</p>
                                    </div>
                                </button>
                            )
                        }) : <></>
                    }
                </div>
                <div className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-sky-600 transition-all duration-300 transform -translate-x-1/2 peer-focus:w-full peer-focus:transform-origin-center rounded-b-[4px]`}></div>
            </div>
        </div>
    )
}
