import * as React from 'react'
import { ActivityTypeOptions, getActivityInformation } from '../../icons/Icon';
import { hexToRgb } from '../../util';

interface IChipsProps {
    label: string;
    states: { [key: string]: boolean }
    onChange: (key: string, state: boolean) => void;
}

export default function Chips({ label, states, onChange }: IChipsProps) {
    return (
        <div className='my-1 w-full flex flex-col text-xs'>
            <div className='flex flex-wrap justify-start bg-neutral-100 pt-5 p-2 rounded-[4px] relative'>
                {
                    ActivityTypeOptions.map((type) => {
                        const styleInformation = getActivityInformation(type);
                        return <Chip label={type} color={styleInformation.color} active={states[type]} onClicked={(state: boolean) => onChange(type, state)} />
                    })
                }
                <p className='text-start text-xs absolute left-2 top-0.5 font-semibold text-gray-500 tracking-wide'>{label}</p>
            </div>
        </div>
    )
}

interface IChipProps {
    label: string;
    color: string;
    active: boolean;
    onClicked: (state: boolean) => void;
}

function Chip({ label, color, active, onClicked }: IChipProps) {
    return (
        <div className="flex justify-end items-center my-px">
            <input
                type="checkbox"
                id={label}
                tabIndex={1}
                className="hidden peer"
                checked={active}
            />
            <div className={`rounded-[4px] border border-solid mr-1 px-2 py-0.5 bg-opacity-30 duration-150 transition-colors cursor-pointer select-none shadow-dynamics`} 
                style={{ 
                    color: active ? color : "#6b7280",
                    borderColor: active ? color : "#6b7280",
                    backgroundColor: active ? `rgba(${hexToRgb(color)}, 0.15)` : `rgba(${hexToRgb("#6b7280")}, 0.15)`
                }}
                onClick={() => onClicked(!active)}>
                <label htmlFor={label} className='text-xs pointer-events-none'>{label}</label>
            </div>
        </div>
    )
}
