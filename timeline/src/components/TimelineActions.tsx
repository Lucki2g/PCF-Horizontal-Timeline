import * as React from 'react'
import { ActivityType, ActivityTypeOptions, getActivityInformation } from '../icons/Icon';
import { motion } from 'framer-motion';
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import FilterDialog from './FilterDialog';
import { TimelineItem } from './TimelineItem';
import { FilterState, useFilter } from '../../contexts/filter-context';
import { useGlobalLoaderContext } from '../../contexts/loader-context';

interface ITimelineActionsProps {
    locale: string,
    items: TimelineItem[];
    isPaneOpen: boolean;
    onSave: (filter: FilterState) => void;
    paneChange: () => void;
}

export default function TimelineActions({ locale, items, isPaneOpen, onSave, paneChange }: ITimelineActionsProps) {

    const { resetFilters } = useFilter();
    const { showDialog } = useGlobalDialogContext();
    const { setState } = useGlobalLoaderContext();

    return (
        <>
            <div className={`absolute flex top-2 left-2 z-20`}>
                <div className='bg-white rounded-[4px] shadow-dynamics flex justify-center items-center mr-1'>
                    <button onClick={() => {resetFilters(); setState(true)}} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        <svg className='' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                            <path d="M1297 38q166 45 304 140t237 226 155 289 55 331q0 141-36 272t-103 245-160 207-208 160-245 103-272 37q-141 0-272-36t-245-103-207-160-160-208-103-244-37-273q0-140 37-272t105-248 167-212 221-164H256V0h512v512H640V215q-117 56-211 140T267 545 164 773t-36 251q0 123 32 237t90 214 141 182 181 140 214 91 238 32q123 0 237-32t214-90 182-141 140-181 91-214 32-238q0-150-48-289t-136-253-207-197-266-124l34-123z" fill="#333333"></path>
                        </svg>
                    </button>
                    <div className='w-px h-full fill-gray-500' />
                    <button onClick={() => showDialog(<FilterDialog locale={locale} items={items} onSave={onSave} />)} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                            <path d="M2048 128v219l-768 768v805H768v-805L0 347V128h2048zm-128 128H128v37l768 768v731h256v-731l768-768v-37z"></path>
                        </svg>
                    </button>
                    <div className='w-px h-full fill-gray-500' />
                    <button onClick={paneChange} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        {
                            isPaneOpen ? 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                                <path d="M2048 384H0v1152h2048V384zm-128 128v896H640V512h1280zM128 1408V512h384v896H128zm931-765L742 960l317 317 90-90-162-163h421V896H987l162-163-90-90z"></path>
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                                <path d="M0 384h2048v1152H0V384zm128 128v896h1280V512H128zm1792 896V512h-384v896h384zM989 643l317 317-317 317-90-90 162-163H640V896h421L899 733l90-90z"></path>
                            </svg>
                        }
                        
                    </button>
                </div>
            </div>
        </>
    )
}
