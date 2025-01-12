import * as React from 'react'
import { IEntityReference, TimelineItem } from '../TimelineItem';
import { getIcon } from '../../util';

interface ILookupProps {
    options: IEntityReference[];
    currentValue: IEntityReference | null;
    label: string;
    handleChange: (newValue: IEntityReference | null) => void;
}

export default function Lookup({ options, label, currentValue, handleChange }: ILookupProps) {

    const inputRef = React.useRef<HTMLInputElement>(null);

    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [query, setQuery] = React.useState<string>(currentValue?.name ?? "");

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
            <p className='text-start text-xs font-semibold text-gray-500 tracking-wide mb-1'>{label}:</p>
            <div className='relative w-full'>
                <input 
                ref={inputRef}
                value={getInput()} 
                onChange={(e) => { setQuery(e.target.value); handleChange(null) }} 
                onClick={toggle}
                type='text' 
                tabIndex={1}
                className='w-full box-border bg-neutral-100 focus:outline-none p-1 rounded-[4px]'></input>
                <span className='w-4 h-4 absolute right-2 top-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                        <path d="M1344 0q97 0 187 25t168 71 142 110 111 143 71 168 25 187q0 97-25 187t-71 168-110 142-143 111-168 71-187 25q-125 0-239-42t-211-121l-785 784q-19 19-45 19t-45-19-19-45q0-26 19-45l784-785q-79-96-121-210t-42-240q0-97 25-187t71-168 110-142T989 96t168-71 187-25zm0 1280q119 0 224-45t183-124 123-183 46-224q0-119-45-224t-124-183-183-123-224-46q-119 0-224 45T937 297 814 480t-46 224q0 119 45 224t124 183 183 123 224 46z"></path>
                    </svg>
                </span>
                {/* DROP DOWN */}
                <div className={`${isOpen ? "max-h-32 h-auto p-2 shadow-dynamics overflow-y-auto" : "h-0 p-0"} flex flex-col w-full absolute top-9 z-50 rounded-[4px] bg-white transition-all duration-150`}>
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
                <div className={`absolute bottom-0 left-1/2 h-0.5 bg-sky-600 transition-all duration-300 transform -translate-x-1/2 ${isOpen ? "w-full transform-origin-center" : "w-0"} rounded-b-[4px]`}></div>
            </div>
        </div>
    )
}
