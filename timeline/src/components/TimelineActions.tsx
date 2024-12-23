import * as React from 'react'
import { ActivityType, ActivityTypeOptions, getActivityInformation } from '../icons/Icon';
import { motion } from 'framer-motion';
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import FilterDialog from './FilterDialog';
import { TimelineItem } from './TimelineItem';
import { FilterState, useFilter } from '../../contexts/filter-context';

interface ITimelineActionsProps {
    locale: string,
    items: TimelineItem[];
    isMouseDown: boolean;
    refresh: () => void;
    onSave: (filter: FilterState) => void;
}

export default function TimelineActions({ locale, items, isMouseDown, refresh, onSave }: ITimelineActionsProps) {

    const { resetFilters } = useFilter();
    const { showDialog } = useGlobalDialogContext();

    return (
        <>
            <div className={`absolute flex top-2 right-2 z-20 ${isMouseDown ? "pointer-events-none" : "pointer-events-auto"}`}>
                <div className='bg-white group rounded-[4px] shadow-dynamics flex justify-center items-center mr-1'>
                    <button onClick={() => showDialog(<FilterDialog locale={locale} items={items} onSave={onSave} />)} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] group-hover:bg-slate-100 duration-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                            <path d="M2048 128v219l-768 768v805H768v-805L0 347V128h2048zm-128 128H128v37l768 768v731h256v-731l768-768v-37z"></path>
                        </svg>
                    </button>
                </div>
                <div className='bg-white group rounded-[4px] shadow-dynamics flex justify-center items-center'>
                    <button onClick={() => {resetFilters(); refresh()}} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] group-hover:bg-slate-100 duration-200 transition-colors">
                        <svg className='' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                            <path d="M1297 38q166 45 304 140t237 226 155 289 55 331q0 141-36 272t-103 245-160 207-208 160-245 103-272 37q-141 0-272-36t-245-103-207-160-160-208-103-244-37-273q0-140 37-272t105-248 167-212 221-164H256V0h512v512H640V215q-117 56-211 140T267 545 164 773t-36 251q0 123 32 237t90 214 141 182 181 140 214 91 238 32q123 0 237-32t214-90 182-141 140-181 91-214 32-238q0-150-48-289t-136-253-207-197-266-124l34-123z" fill="#333333"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}
