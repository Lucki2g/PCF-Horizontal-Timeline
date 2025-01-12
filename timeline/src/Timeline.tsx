import * as React from 'react'
import { IInputs } from '../generated/ManifestTypes'
import { addDayToDate, getLeft, removeDayFromDate, TimeOptions, TimeUnit, ySize } from './timeUtil';
import { IEntityReference, TimelineItem } from './components/TimelineItem';
import { ActivityType, ActivityTypeOptions } from './icons/Icon';
import TimelineActions from './components/TimelineActions';
import { FilterState, useFilter } from '../contexts/filter-context';
import TimelessTimelineItemBlock from './components/TimelessTimelineItem';
import { useTranslation } from 'react-i18next';
import { useGlobalLoaderContext } from '../contexts/loader-context';
import { TimelineDataCanvas, TimelineDataCanvasHandle } from './components/TimelineDataCanvas';
import { uuidv4 } from './util';
import i18n from '../contexts/i18n';

interface ITimelineProps {
    context: ComponentFramework.Context<IInputs>;
}

export const DEBUG = false;

export default function Timeline({ context }: ITimelineProps) {
    const size = context.mode.allocatedWidth;
    if (size <= 0) return <></>;

    const randomID = React.useMemo(() => {
        return uuidv4();
    }, []);

    // Settings
    const LOCALE = context.parameters.locale.raw ?? "en-US";
    const OPTIONS: TimeOptions = {
        years: context.parameters.yearsformat.raw ?? "full",
        quarterPrefix: context.parameters.quartersformat.raw ?? "",
        months: context.parameters.monthsformat.raw ?? "long",
        weeksPrefix: context.parameters.weeksformat.raw ?? "",
        days: context.parameters.daysformat.raw ?? "numeric",
        hours: context.parameters.hoursformat.raw ?? "numeric",
        hourCycle: context.parameters.hourscycle.raw ?? "23h",
        minutes: "2-digit",
        seconds: "2-digit"
    } as TimeOptions;
    const ROUNDING = (context.parameters.rounding.raw ?? "day") as any;
    const TIMEUNITSUNSORTED: { value: TimeUnit, sort: number }[] = [];
    if (context.parameters.yearsenabled.raw) TIMEUNITSUNSORTED.push({ value: TimeUnit.Year, sort: context.parameters.yearspos.raw ?? 3 });
    if (context.parameters.quartersenabled.raw) TIMEUNITSUNSORTED.push({ value: TimeUnit.Quarter, sort: context.parameters.quarterpos.raw ?? 5 });
    if (context.parameters.monthsformat.raw) TIMEUNITSUNSORTED.push({ value: TimeUnit.Month, sort: context.parameters.monthspos.raw ?? 2 });
    if (context.parameters.weeksenabled.raw) TIMEUNITSUNSORTED.push({ value: TimeUnit.Week, sort: context.parameters.weekspos.raw ?? 4 });
    if (context.parameters.daysenabled.raw) TIMEUNITSUNSORTED.push({ value: TimeUnit.Day, sort: context.parameters.dayspos.raw ?? 1 });
    if (context.parameters.hoursenabled.raw) TIMEUNITSUNSORTED.push({ value: TimeUnit.Hour, sort: context.parameters.hourspos.raw ?? 0 });
    const TIMEUNITS = TIMEUNITSUNSORTED.sort((prev, curr) => prev.sort - curr.sort).map(i => i.value);
    
    // States
    const [isMouseDown, setMouseDown] = React.useState<boolean>(false);
    const [isPaneOpen, setPaneOpen] = React.useState<boolean>(false);
    const [startX, setStartX] = React.useState<number>(0.0);
    const [left, setLeft] = React.useState<number>(0.0);
    const [items, setItems] = React.useState<TimelineItem[]>([]);
    const [height, setHeight] = React.useState<number>(0);
    const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

    // Refs
    const timelineRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<TimelineDataCanvasHandle>(null);

    // Context
    const { filter, initialize, setFilter, filterItems } = useFilter();
    const { t } = useTranslation();
    const { loadingstate, setState } = useGlobalLoaderContext();

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
        if (!isMouseDown || isAnimating) return;
      
        let x = 0;
        if (!mobile) {
            e.preventDefault();
            x = e.pageX;
        } else {
            const touch = e.touches[0];
            x = touch.pageX;
        }
      
        const walk = (x - startX) * 3;
        const newLeftRounded = Math.max(0, left - walk);
        
        updateLeft(newLeftRounded, e.target)
    }

    const updateLeft = (location: number, timeline: HTMLElement) => {
        const canvas = document.getElementById(`canvas-${randomID}`) as HTMLCanvasElement;
        if (timeline instanceof HTMLElement && canvas && canvasRef.current) {

            const maxScrollLeft = canvasRef.current.getMaxSize();
            const newValue = Math.max(0, Math.min(maxScrollLeft, location));

            timeline.scrollLeft = newValue;
            canvas.style.left = newValue + "px";
            canvasRef.current.draw(canvas, newValue);
        }
    }

    // Effects
    React.useEffect(() => {
        setState(true);
        i18n.changeLanguage(LOCALE);
    }, [])

    React.useEffect(() => {
        if (loadingstate) refresh();
        if (!loadingstate && timelineRef.current) 
            animateLeft(
                0, 
                getLeft(
                    new Date(), 
                    filter.startDate, 
                    context.parameters.xsize.raw ?? 32
                ) - timelineRef.current.clientWidth / 2, 
                timelineRef.current,
                1000);
    }, [loadingstate])

    const animateLeft = (start: number, end: number, element: HTMLElement, duration: number) => {
        if (isAnimating) return;
        setIsAnimating(true);

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

        setTimeout(() => setIsAnimating(false), duration)
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
                },
                {
                    id: "2",
                    name: "Another reminder",
                    type: "task",
                    date: new Date("2024-11-21T16:00:00.000Z"),
                },
                {
                    id: "3",
                    name: "What is this?",
                    type: "task",
                    date: new Date("2024-11-21T15:00:00.000Z"),
                },
                {
                    id: "3S",
                    name: "Estimated Close",
                    type: "milestone",
                    date: new Date("2024-11-17"),
                },
                {
                    id: "4",
                    name: "I am overlapping?",
                    type: "appointment",
                    date: new Date("2024-11-01T15:30:45"),
                    owned: {
                        id: "1",
                        name: "SME",
                        entitytype: "team"
                    }
                },
                {
                    id: "5",
                    name: "Email",
                    type: "email",
                    date: new Date("2024-11-20T15:30:45"),
                    owned: {
                        id: "2",
                        name: "Kaare",
                        entitytype: "systemuser"
                    }
                },
                {
                    id: "6",
                    name: "Phone Call",
                    type: "phonecall",
                    date: new Date("2024-11-20T15:30:45"),
                    owned: {
                        id: "3",
                        name: "Børsting",
                        entitytype: "systemuser"
                    }
                },
                {
                    id: "7",
                    name: "Phone Call",
                    type: "phonecall",
                    date: new Date("2025-02-02T23:59:59"),
                    owned: {
                        id: "4",
                        name: "Hello",
                        entitytype: "systemuser"
                    }
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
                    endDate: addDayToDate(end),
                    owner: null
                }
            );
            setState(false);
        } else {
            const activities = context.parameters.activities.sortedRecordIds.map((id: string): TimelineItem => {
                const activity = context.parameters.activities.records[id];
                const scheduledEnd = activity.getValue("scheduledend") === null ? null : new Date(activity.getValue("scheduledend") as string);

                const owner = {
                    id: (activity.getValue("ownerid") as any).id.guid,
                    name: (activity.getValue("ownerid") as any).name,
                    entitytype: (activity.getValue("ownerid") as any).etn
                } as IEntityReference;

                return {
                    id: id,
                    name: activity.getValue("name") as string,
                    date: scheduledEnd,
                    type: activity.getValue("activitytypecode") as ActivityType,
                    owned: owner,
                }
            });

            // get the different event milestones
            const result = await context.webAPI.retrieveRecord(
                (context.mode as any).contextInfo.entityTypeName, 
                (context.mode as any).contextInfo.entityId);
            const milestonesdate = context.parameters.milestonedata.raw ?? "{}";
            const milestones = JSON.parse(milestonesdate);
            for (const milestone of Object.keys(milestones)) {
                if (!result[milestone] || result[milestone] === null || result[milestone] === undefined) continue;
                const date = new Date(result[milestone]);
                activities.push({
                    id: milestone,
                    name: milestones[milestone],
                    type: "milestone",
                    date: date,
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
                    endDate: addDayToDate(end),
                    owner: null
                }
            );
            setState(false);
        }
    }

    return loadingstate ?
            <></> :
            <div className='w-full h-full relative flex items-start justify-center text-dynamics-text font-dynamics select-none'>
                {/* Loading */}
                { loadingstate ? <div className='w-full h-1 bg-black'></div> : <></> }

                {/* Actions */}
                <TimelineActions context={context} timelineRef={timelineRef} animate={animateLeft} isPaneOpen={isPaneOpen} paneChange={() => setPaneOpen(!isPaneOpen)} locale={LOCALE} items={items}  
                onSave={(filter: FilterState) => { 
                    setFilter(filter);
                }} />

                {/* Timeline */}
                <div ref={timelineRef} className={`${isAnimating ? "cursor-wait" : isMouseDown ? "cursor-grabbing" : "cursor-grab"} border border-solid border-gray-700 rounded-lg w-full shadow-dynamics bg-slate-200 overflow-x-hidden relative inset-0 bg-[linear-gradient(45deg,#ffffff33_25%,transparent_25%,transparent_75%,#ffffff33_75%,#ffffff33),linear-gradient(45deg,#ffffff33_25%,transparent_25%,transparent_75%,#ffffff33_75%,#ffffff33)] bg-[position:0_0,10px_10px] bg-[size:20px_20px]`}
                onMouseDown={(e) => mouseDown(e)} onMouseUp={mouseOut} onMouseLeave={mouseOut} onMouseMove={(e) => mouseMove(e)} 
                onTouchStart={(e) => mouseDown(e, true)} onTouchEnd={mouseOut} onTouchMove={(e) => mouseMove(e, true)}>
                    <TimelineDataCanvas uuid={randomID} ref={canvasRef} setHeight={(height: number) => setHeight(height)} items={items} context={context} locale={LOCALE} rounding={ROUNDING} options={OPTIONS} units={TIMEUNITS} />
                </div>

                {/* Pane */}
                <div className={`flex-grow ${isPaneOpen ? "w-64 opacity-100 ml-2 p-2 border" : "w-0 opacity-0 p-0"} border-solid border-gray-700 rounded-lg bg-white flex flex-col items-start duration-300 transition-all`} style={{ height: height }}>
                    <h1 className='font-semibold text-sm'>{t("timeless_title")}</h1>
                    <p className='text-[9px] text-gray-500 mb-2'>{t("timeless_description")}</p>
                    <div className='flex flex-col overflow-y-scroll w-full h-full justify-center items-center'>
                    {
                        items.filter(i => i.date === null).length === 0 ?
                        <p className='text-xs'>{t("timeless_noitems")}</p> :
                        items.filter(i => i.date === null).map(i => {
                            return (
                                <TimelessTimelineItemBlock key={i.id} context={context} item={i} />
                            );
                        })
                    }
                    </div>
                </div>
            </div>
}
