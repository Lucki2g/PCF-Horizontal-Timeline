import * as React from 'react'
import { IInputs } from '../../generated/ManifestTypes';
import { fontSize, getAvailableTimeUnits, getLeft, ITEM_PADDING, TimeUnit, timeUnitInformation, TimeUnits, ySize } from '../timeUtil';
import { useTranslation } from 'react-i18next';
import { useFilter } from '../../contexts/filter-context';
import TimelineItemBlock, { TimelineItem } from './TimelineItem';

// OBS: HTML Elements fill up the DOM extremely quickly causing lag and performance issues.
// OBS: Lazy Loading would only work until elements were loaded.
// OBS: Virtualization batches scroll events causing "blinking" when scrolling.
// OBS: Browsers have limits for the canvas area, hence why there is a limit on visible dates. This limit is controlled by available system memory and other factors.

export type RoundingType = "year" | "quarter" | "month" | "day" | "none";

export interface TimeOptions {
  years: "full" | "short";
  quarterPrefix: string;
  months: "numeric" | "2-digit" | "long" | "short" | "narrow";
  weeksPrefix: string;
  days: "numeric" | "2-digit" | "long" | "short" | "narrow";
  hourCycle: "h11" | "h12" | "h23" | "h24";
  hours: "numeric" | "2-digit";
  minutes: "numeric" | "2-digit";
  seconds: "numeric" | "2-digit";
}

interface TimelineDataCanvasProps {
    context: ComponentFramework.Context<IInputs>;
    locale: string;
    options: TimeOptions;
    rounding: RoundingType;
    units: TimeUnit[];
    items: TimelineItem[];
    setHeight: (height: number) => void;
}

export interface TimelineDataCanvasHandle {
    draw: (canvas: HTMLCanvasElement, scrollOffsetX: number) => void;
}

export const TimelineDataCanvas = React.forwardRef<TimelineDataCanvasHandle, TimelineDataCanvasProps>(({ setHeight, items, context, locale, options, rounding, units }: TimelineDataCanvasProps, ref) => {
    
    React.useImperativeHandle(ref, () => ({
        draw
    }));

    // Context
    const { t } = useTranslation();
    const { filter } = useFilter();

    // Refs
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Memo states
    const timeUnits = React.useMemo<TimeUnits>(() => {
        const unitData = getAvailableTimeUnits(filter.startDate, filter.endDate, units, options, locale, rounding);
        return unitData;
    }, [filter.startDate, filter.endDate]);
    
    // Variables
    const xSize = context.parameters.xsize.raw ?? 32;
    const totalWidth = timeUnits[Object.keys(timeUnits)[0]].reduce((acc, item) => acc + item.hours, 0) * xSize;
    const width = context.mode.allocatedWidth;
    const height = units.length * ySize;

    // Early return
    if (timeUnits === null) return <></>;

    // Effects
    React.useEffect(() => {
        // initial draw
        const canvas = canvasRef.current;
        if (!canvas) return;
        draw(canvas, 0);
    }, []);

    // Functions
    const draw = (canvas: HTMLCanvasElement, scrollOffsetX: number) => {
        const renderer = canvas.getContext("2d")!;
        // clear
        renderer.fillStyle = "#fff";
        renderer.fillRect(0, 0, width, height);

        ///////////////////////////////////////////////////
        //                  TIME ELEMENTS                //
        ///////////////////////////////////////////////////
        // draw - OBS canvas calculates from the halfed pixel hence we add .5 many places
        renderer.lineWidth = 1;
        renderer.textBaseline = "bottom";
        renderer.textAlign = "left";
        renderer.font = `normal ${fontSize}px "Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",Arial,sans-serif`
        for (const [idx, unit] of units.entries()) {
            const info = timeUnitInformation(unit);
            const rectHeight = idx * ySize;
            let x = 0;
            
            renderer.fillStyle = "#1f2937";
            // Items
            for (const [i, timeunit] of timeUnits[info.timeUnits].entries()) {
                const currentRectWidth = (timeunit.hours * xSize);

                // left line
                renderer.strokeStyle = "#9ca3af";
                renderer.setLineDash([1, 2]);
                if (i === 0) {
                    renderer.beginPath();
                    renderer.moveTo(x + .5 - scrollOffsetX, rectHeight);
                    renderer.lineTo(x + .5 - scrollOffsetX, rectHeight + ySize);
                    renderer.closePath();
                    renderer.stroke();
                }
                // right line
                renderer.beginPath();
                renderer.moveTo(x + currentRectWidth + .5 - scrollOffsetX, rectHeight);
                renderer.lineTo(x + currentRectWidth + .5 - scrollOffsetX, rectHeight + ySize);
                renderer.closePath();
                renderer.stroke();

                // top line
                renderer.strokeStyle = "#1f2937";
                renderer.setLineDash([0, 0]);
                if (idx === 0) {
                    renderer.beginPath();
                    renderer.moveTo(x - scrollOffsetX, rectHeight + .5);
                    renderer.lineTo(x + currentRectWidth - scrollOffsetX, rectHeight + .5);
                    renderer.closePath();
                    renderer.stroke();
                }
                renderer.beginPath();
                renderer.moveTo(x - scrollOffsetX, rectHeight + .5 + ySize);
                renderer.lineTo(x + currentRectWidth - scrollOffsetX, rectHeight + .5 + ySize);
                renderer.closePath();
                renderer.stroke();

                // text
                if (unit !== TimeUnit.Hour) {
                    const leftSide = x + fontSize - scrollOffsetX;
                    const rightSide = x + currentRectWidth - 4 - timeunit.name.length * (fontSize / 2) - scrollOffsetX;
                    const stickyX = Math.min(Math.max(leftSide, 3.5), rightSide);
                    // no longer in rect
                    if (!(stickyX > rightSide)) renderer.fillText(timeunit.name, stickyX, rectHeight - 1 + ySize);
                } else if (i % 6 === 0 && i % 24 !== 0) {
                    renderer.fillStyle = "#fff";
                    renderer.fillRect(x - fontSize / 2 - scrollOffsetX, rectHeight + fontSize + 4, fontSize, fontSize)
                    renderer.fillStyle = "#1f2937";
                    renderer.fillText(timeunit.name, x - fontSize / 2 - scrollOffsetX, rectHeight - 1 + ySize);
                }

                x += currentRectWidth;
            }

            // Titles
            const i18title = t(info.i18ntranslation);
            renderer.fillStyle = "#fff";
            renderer.fillRect(3.5, rectHeight + 3.5, i18title.length * fontSize / 2, fontSize)
            renderer.fillStyle = "#9ca3af";
            renderer.fillText(i18title, 3.5, rectHeight - 1 + ySize - fontSize);
        }
    }

    const areItemsOverlapping = (item1: TimelineItem, item2: TimelineItem): boolean => {
        const left1 = getLeft(item1.date!, filter.startDate, context.parameters.xsize.raw ?? 32);
        const left2 = getLeft(item2.date!, filter.startDate, context.parameters.xsize.raw ?? 32);
        const width1 = (fontSize / 2) * item1.name.length + 32; 
        const width2 = (fontSize / 2) * item2.name.length + 32;
        return !(left1 + width1 < left2 || left2 + width2 < left1);
    };

    const arrangeItemsInRows = (): TimelineItem[][] => {
        const newRows: TimelineItem[][] = [];

        items.forEach(item => {
            let placed = false;

            for (const row of newRows) {
                const overlap = row.some(existingItem => areItemsOverlapping(existingItem, item));
                if (!overlap) {
                    row.push(item);
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                newRows.push([item]);
            }
        });

        return newRows.reverse();
    };

    const rows = React.useMemo(() => {
        return arrangeItemsInRows();
    }, [items, filter.startDate, filter.endDate]);

    // not optimal as it changes state on the parent rendering element
    setHeight(height + ITEM_PADDING * 2 + rows.length * ySize + 2);

    return (
        <div className='flex flex-col overflow-x-inherit pointer-events-none w-full relative' style={{
            width: totalWidth, 
            maxWidth: totalWidth
        }}>
            {/* NOW */}
            <div className='w-px h-full bg-red-400 absolute z-10' style={{ left: getLeft(new Date(), filter.startDate, context.parameters.xsize.raw ?? 32) }}>
                <span className='absolute w-[5px] h-[5px] rounded-full border bg-red-400 border-dynamics-text' style={{ bottom: height - 2, left: -2 }}></span>
            </div>
            {/* ACTIVITIES */}
            <div ref={containerRef} className="w-full flex flex-col z-10" style={{ 
                paddingTop: ITEM_PADDING, 
                paddingBottom: ITEM_PADDING, 
                width: totalWidth, 
                maxWidth: totalWidth,
                height: ITEM_PADDING * 2 + rows.length * ySize + height 
            }}>
                {
                    rows.map((rowItems, rowIndex) => (
                        <div key={"row-" + rowIndex} className="flex relative w-full" style={{ height: ySize }}>
                            {rowItems.map(item => (
                                <TimelineItemBlock 
                                    key={"item-" + item.id}
                                    context={context}
                                    item={item}
                                    parentRef={containerRef}
                                    rowIdx={rowIndex}
                                    rowCount={rows.length - 1}
                                    timeunits={units}
                                />
                            ))}
                        </div>
                    ))
                }
            </div>
            {/* DATE DATA */}
            <canvas id='canvas' className='absolute bottom-0' 
            ref={canvasRef} 
            width={width} 
            height={height} 
            style={{ width: width, height: height }} />
        </div>
    )
})