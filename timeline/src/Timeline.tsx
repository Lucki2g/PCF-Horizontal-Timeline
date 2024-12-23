import * as React from 'react'
import { IInputs } from '../generated/ManifestTypes'
import { addDayToDate, getLeft, removeDayFromDate, TimeUnit, ySize } from './timeUtil';
import {  TimelineData } from './components/TimelineData';
import { TimelineItem } from './components/TimelineItem';
import TimelineItems from './components/TimelineItems';
import { ActivityType, ActivityTypeOptions } from './icons/Icon';
import TimelineActions from './components/TimelineActions';
import { FilterState, useFilter } from '../contexts/filter-context';

interface ITimelineProps {
    context: ComponentFramework.Context<IInputs>;
}

export const DEBUG = true;

export default function Timeline({ context }: ITimelineProps) {

    // Settings
    const LOCALE = context.parameters.locale.raw ?? "en-US";
    const OPTIONS = JSON.parse(context.parameters.timedata.raw ?? "{}");
    const ROUNDING = (context.parameters.rounding.raw ?? "day") as any;
    const TIMEUNITS = context.parameters.timeunits.raw?.trim().split(",").map(t => Number(t)) ?? [TimeUnit.Year, TimeUnit.Month, TimeUnit.Day];
    
    // States
    const [isMouseDown, setMouseDown] = React.useState<boolean>(false);
    const [startX, setStartX] = React.useState<number>(0.0);
    const [left, setLeft] = React.useState<number>(0.0);
    const [items, setItems] = React.useState<TimelineItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    // Refs
    const timelineRef = React.useRef<HTMLDivElement>(null);

    // Context
    const { filter, initialize } = useFilter();

    // Events
    function mouseDown(e: any, mobile: boolean = false) {
        setMouseDown(true);
        if (!mobile) {
        setStartX(e.pageX)
        } else {
        const touch = e.touches[0]
        setStartX(touch.pageX)
        }
        setLeft(e.target.scrollLeft)
    }

    function mouseOut() {
        setMouseDown(false);
    }

    function mouseMove(e: any, mobile = false) {
        if (!isMouseDown) return;
      
        let x = 0;
        if (!mobile) {
            e.preventDefault();
            x = e.pageX;
        } else {
            const touch = e.touches[0];
            x = touch.pageX;
        }
      
        const walk = (x - startX) * 3;
        const newLeft = Math.max(0, left - walk);

        updateLeft(newLeft, e.target);
    }

    const updateLeft = (newLeft: number, element: HTMLElement) => {
      
        if (element instanceof HTMLElement) {
            element.scrollLeft = newLeft;
        }
    
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        if (element.scrollLeft >= maxScrollLeft) return;
    
        const absoluteElements = document.querySelectorAll('.abs');
        absoluteElements.forEach((el: any) => {
            el.style.left = `${newLeft}px`;
        });
    }

    // Effects
    React.useEffect(() => {
        refresh();
    }, [])

    React.useEffect(() => {
        if (timelineRef.current) animateLeft(0, getLeft(new Date(), filter.startDate) - timelineRef.current.clientWidth / 2, timelineRef.current, 1000);
    }, [loading])

    const animateLeft = (start: number, end: number, element: HTMLElement, duration = 500) => {
        const startTime = performance.now();
        const distance = end - start;
    
        const step = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const newLeft = start + distance * progress;
    
            updateLeft(newLeft, element);
    
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
    
        requestAnimationFrame(step);
    };

    const refresh = async () => {
        let start = new Date("9999-12-31");
        let end = new Date("0000-01-01");
        if (DEBUG) {
            const items: TimelineItem[] = [
                {
                    id: "1",
                    name: "Remember the chicken",
                    type: "task",
                    date: new Date("2024-10-18"),
                    show: true
                },
                {
                    id: "2",
                    name: "Another reminder",
                    type: "task",
                    date: new Date("2024-11-21T16:00:00.000Z"),
                    show: true
                },
                {
                    id: "3",
                    name: "What is this?",
                    type: "task",
                    date: new Date("2024-11-21T15:00:00.000Z"),
                    show: true
                },
                {
                    id: "3S",
                    name: "Estimated Close",
                    type: "milestone",
                    date: new Date("2024-11-17"),
                    show: true
                },
                {
                    id: "4",
                    name: "I am overlapping?",
                    type: "appointment",
                    date: new Date("2024-11-01T15:30:45"),
                    show: true
                },
                {
                    id: "5",
                    name: "Email",
                    type: "email",
                    date: new Date("2024-11-20T15:30:45"),
                    show: true
                },
                {
                    id: "6",
                    name: "Phone Call",
                    type: "phonecall",
                    date: new Date("2024-11-20T15:30:45"),
                    show: true
                },
                {
                    id: "7",
                    name: "Phone Call",
                    type: "phonecall",
                    date: new Date("2025-01-01T23:59:59"),
                    show: true
                }
            ];

            for (const item of items) {
                if (!item.date) continue;
                if (item.date < start) start = item.date;
                if (item.date > end) end = item.date;
            }

            if (new Date() > end) end = new Date();

            setItems(items);
            initialize(
                {
                    search: "",
                    itemTypes: ActivityTypeOptions.reduce(
                        (acc, type) => ({ ...acc, [type]: true }),
                        {}
                    ),
                    startDate: removeDayFromDate(start),
                    endDate: addDayToDate(end)
                }
            );
            setLoading(false);
        } else {
            const activities = context.parameters.activities.sortedRecordIds.map((id: string): TimelineItem => {
                const activity = context.parameters.activities.records[id];

                const scheduledEnd = activity.getValue("scheduledend") === null ? null : new Date(activity.getValue("scheduledend") as string);

                return {
                    id: id,
                    name: activity.getValue("name") as string,
                    date: scheduledEnd,
                    type: activity.getValue("activitytypecode") as ActivityType,
                    show: true
                }
            });

            // get the different event milestones
            const result = await context.webAPI.retrieveRecord(
                (context.mode as any).contextInfo.entityTypeName, 
                (context.mode as any).contextInfo.entityId);
            const milestonesdate = context.parameters.milestonedata.raw ?? "{}";
            const milestones = JSON.parse(milestonesdate);
            for (const milestone of Object.keys(milestones)) {
                if (result[milestone] === null) continue;
                let date;
                try {
                    date = new Date(result[milestone]);
                } catch(e) {
                    continue;
                }
                activities.push({
                    id: milestone,
                    name: milestones[milestone],
                    type: "milestone",
                    date: date,
                    show: true
                });
            }

            for (const item of activities) {
                if (!item.date) continue;
                if (item.date < start) start = item.date;
                if (item.date > end) end = item.date;
            }

            if (new Date() > end) end = new Date();

            setItems(activities);
            initialize(
                {
                    search: "",
                    itemTypes: ActivityTypeOptions.reduce(
                        (acc, type) => ({ ...acc, [type]: true }),
                        {}
                    ),
                    startDate: removeDayFromDate(start),
                    endDate: addDayToDate(end)
                }
            );
            setLoading(false);
        }
    }

    if (loading) return <></>;

    return (
        <div className='w-full h-full relative flex items-start justify-center text-dynamics-text font-dynamics select-none m-4 rounded-[4px]'>
            <TimelineActions locale={LOCALE} items={items} refresh={refresh} isMouseDown={isMouseDown} onSave={(filter: FilterState) => { 
                const filteredItems = items.map(i => {
                    const show = 
                        i.name.toLowerCase().includes(filter.search) &&
                        filter.itemTypes[i.type] &&
                        i.date !== null && filter.startDate <= i.date && i.date <= filter.endDate
                    return { ...i, show: show }
                });
                setItems(filteredItems);
            }} />
            {/* <div className='max-h-full w-64 rounded-[4px] p-2 shadow-dynamics bg-white mr-2 flex flex-col self-start'>
                <h1 className='font-semibold text-sm'>Timeless items</h1>
                <p className='text-[9px] text-gray-500 mb-2'>These items have no due date set.</p>
                {
                    items.filter(i => i.date === null).length === 0 ?
                    <p className='text-xs'>No items...</p>
                    :
                    <div className='flex flex-col overflow-y-scroll w-full'>
                    {
                        items.filter(i => i.date === null).map(i => {
                            return (
                                <TimelessTimelineItemBlock key={i.id} context={context} item={i} />
                            );
                        })
                    }
                    </div>
                }
            </div> */}
            <div ref={timelineRef} className={`${isMouseDown ? "cursor-grabbing" : "cursor-grab"} w-full shadow-dynamics bg-slate-200 overflow-x-hidden relative inset-0 bg-[linear-gradient(45deg,#ffffff33_25%,transparent_25%,transparent_75%,#ffffff33_75%,#ffffff33),linear-gradient(45deg,#ffffff33_25%,transparent_25%,transparent_75%,#ffffff33_75%,#ffffff33)] bg-[position:0_0,10px_10px] bg-[size:20px_20px]`}
            onMouseDown={(e) => mouseDown(e)} onMouseUp={mouseOut} onMouseLeave={mouseOut} onMouseMove={(e) => mouseMove(e)} 
            onTouchStart={(e) => mouseDown(e, true)} onTouchEnd={mouseOut} onTouchMove={(e) => mouseMove(e, true)}>
                <div className='absolute w-full left-0'></div>                
                <div className="flex flex-col overflow-x-inherit pointer-events-none w-fit">
                    {/* Current time marker */}
                    <div className='w-px h-full bg-red-400 absolute' style={{ left: getLeft(new Date(), filter.startDate) }}>
                        <span className='absolute w-[5px] h-[5px] rounded-full border bg-red-400 border-dynamics-text' style={{ bottom: ySize * 3 - 3, left: -2 }}></span>
                    </div>
                    {/* Data items */}
                    <TimelineItems context={context} items={items.filter(i => i.date !== null)} mouseDown={isMouseDown} timeunits={TIMEUNITS} />
                    {/* Bottom */}
                    <TimelineData locale={LOCALE} rounding={ROUNDING} options={OPTIONS} units={TIMEUNITS} />
                </div>
            </div>
        </div>
    )
}
