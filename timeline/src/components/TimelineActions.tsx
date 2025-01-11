import * as React from 'react'
import { ActivityType, ActivityTypeOptions, getActivityInformation } from '../icons/Icon';
import { motion } from 'framer-motion';
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import FilterDialog from './FilterDialog';
import { TimelineItem } from './TimelineItem';
import { FilterState, useFilter } from '../../contexts/filter-context';
import { useGlobalLoaderContext } from '../../contexts/loader-context';
import { getLeft } from '../timeUtil';
import { IInputs } from '../../generated/ManifestTypes';

interface ITimelineActionsProps {
    context: ComponentFramework.Context<IInputs>;
    locale: string,
    items: TimelineItem[];
    isPaneOpen: boolean;
    onSave: (filter: FilterState) => void;
    paneChange: () => void;
    animate: (start: number, end: number, element: HTMLElement, duration: number) => void;
    timelineRef: React.RefObject<HTMLDivElement>;
}

export default function TimelineActions({ context, animate, timelineRef, locale, items, isPaneOpen, onSave, paneChange }: ITimelineActionsProps) {

    const { resetFilters, filter } = useFilter();
    const { showDialog } = useGlobalDialogContext();
    const { setState } = useGlobalLoaderContext();

    const animateNext = () => {
        if (!timelineRef.current) return;
        const centerOfCanvas = (timelineRef.current.scrollLeft + timelineRef.current.clientWidth / 2); 
        const activityLocations = items
            .filter(item => item.date !== null)
            .map(item => {
                return {
                    item: item,
                    left: Math.floor(getLeft(item.date!, filter.startDate, context.parameters.xsize.raw ?? 32))
                }
            })
            
        console.log(activityLocations, centerOfCanvas)
        const nextActivityLocation = activityLocations
            .sort((a, b) => a.left - b.left)
            .find(item => item.left > centerOfCanvas);
        if (!nextActivityLocation) return;
        animate(timelineRef.current.scrollLeft, nextActivityLocation.left - timelineRef.current.clientWidth / 2, timelineRef.current, 1000)
    }

    const animatePrevious = () => {
        if (!timelineRef.current) return;
        const centerOfCanvas = (timelineRef.current.scrollLeft + timelineRef.current.clientWidth / 2); 
        const activityLocations = items
        .filter(item => item.date !== null)
        .map(item => {
            return {
                item: item,
                left: Math.floor(getLeft(item.date!, filter.startDate, context.parameters.xsize.raw ?? 32))
            }
        })
        
        console.log(activityLocations, centerOfCanvas)
        const nextActivityLocation = activityLocations
            .sort((a, b) => a.left - b.left)
            .reverse()
            .find(item => item.left < centerOfCanvas);
        if (!nextActivityLocation) return;
        animate(timelineRef.current.scrollLeft, nextActivityLocation.left - timelineRef.current.clientWidth / 2, timelineRef.current, 1000)
    }

    return (
        <>
            <div className={`absolute flex top-2 left-2 z-20`}>
                <div className='bg-white rounded-[4px] shadow-dynamics flex justify-center items-center mr-1'>
                    {/* Refresh timeline */}
                    <button onClick={() => {resetFilters(); setState(true)}} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        <svg className='' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                            <path d="M1297 38q166 45 304 140t237 226 155 289 55 331q0 141-36 272t-103 245-160 207-208 160-245 103-272 37q-141 0-272-36t-245-103-207-160-160-208-103-244-37-273q0-140 37-272t105-248 167-212 221-164H256V0h512v512H640V215q-117 56-211 140T267 545 164 773t-36 251q0 123 32 237t90 214 141 182 181 140 214 91 238 32q123 0 237-32t214-90 182-141 140-181 91-214 32-238q0-150-48-289t-136-253-207-197-266-124l34-123z" fill="#333333"></path>
                        </svg>
                    </button>
                    {/* Previous activity */}
                    <button onClick={animatePrevious} className="relative flex justify-center items-center w-5 h-5 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M269.23-295.38v-369.24H300v369.24h-30.77Zm421.54 0L420.15-480l270.62-184.62v369.24ZM660-480Zm0 125.77v-252.31L474.38-480 660-354.23Z"/>
                        </svg>
                    </button>
                    {/* Next activity */}
                    <button onClick={animateNext} className="relative flex justify-center items-center w-5 h-5 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M660-295.38v-369.24h30.77v369.24H660Zm-390.77 0v-369.24L539.85-480 269.23-295.38ZM300-480Zm0 125.77L486.38-480 300-606.54v252.31Z" />
                        </svg>
                    </button>
                    <div className='w-px h-full bg-gray-500 mx-0.5' />
                    {/* Filter */}
                    <button onClick={() => showDialog(<FilterDialog locale={locale} items={items} onSave={onSave} />)} className="relative flex justify-center items-center w-5 h-5 p-1 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                            <path d="M2048 128v219l-768 768v805H768v-805L0 347V128h2048zm-128 128H128v37l768 768v731h256v-731l768-768v-37z"></path>
                        </svg>
                    </button>
                    {/* Timeless items */}
                    <button onClick={paneChange} className="relative flex justify-center items-center w-5 h-5 m-0.5 rounded-[4px] hover:bg-slate-100 duration-200 transition-colors">
                        {
                            isPaneOpen ? 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M334.69-596v232l116.77-116-116.77-116ZM215.38-160q-22.44 0-38.91-16.47Q160-192.94 160-215.38v-529.24q0-22.44 16.47-38.91Q192.94-800 215.38-800h529.24q22.44 0 38.91 16.47Q800-767.06 800-744.62v529.24q0 22.44-16.47 38.91Q767.06-160 744.62-160H215.38Zm421.47-30.77h132.38v-553.85q0-9.23-7.69-16.92-7.69-7.69-16.92-7.69H636.85v578.46Zm-30.77 0v-578.46h-390.7q-9.23 0-16.92 7.69-7.69 7.69-7.69 16.92v529.24q0 9.23 7.69 16.92 7.69 7.69 16.92 7.69h390.7Zm30.77 0h132.38-132.38Z" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M451.46-364v-232L334.69-480l116.77 116ZM215.38-160q-22.44 0-38.91-16.47Q160-192.94 160-215.38v-529.24q0-22.44 16.47-38.91Q192.94-800 215.38-800h529.24q22.44 0 38.91 16.47Q800-767.06 800-744.62v529.24q0 22.44-16.47 38.91Q767.06-160 744.62-160H215.38Zm421.47-30.77h132.38v-553.85q0-9.23-7.69-16.92-7.69-7.69-16.92-7.69H636.85v578.46Zm-30.77 0v-578.46h-390.7q-9.23 0-16.92 7.69-7.69 7.69-7.69 16.92v529.24q0 9.23 7.69 16.92 7.69 7.69 16.92 7.69h390.7Zm30.77 0h132.38-132.38Z" />
                            </svg>
                        }
                    </button>
                </div>
            </div>
        </>
    )
}
