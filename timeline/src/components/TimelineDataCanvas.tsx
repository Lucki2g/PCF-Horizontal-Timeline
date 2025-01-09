import * as React from 'react'
import { IInputs } from '../../generated/ManifestTypes';
import { fontSize, getAvailableTimeUnits, TimeUnit, timeUnitInformation, TimeUnits, ySize } from '../timeUtil';
import { useTranslation } from 'react-i18next';
import { useFilter } from '../../contexts/filter-context';
import { RoundingType, TimeOptions } from './TimelineData';

interface TimelineDataCanvasProps {
    context: ComponentFramework.Context<IInputs>;
    locale: string;
    options: TimeOptions;
    rounding: RoundingType;
    units: TimeUnit[];
}

export default function TimelineDataCanvas({ context, locale, options, rounding, units }: TimelineDataCanvasProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const xSize = context.parameters.xsize.raw ?? 32;

    const { t } = useTranslation();
    const { filter } = useFilter();
    
    const timeUnits = React.useMemo<TimeUnits>(() => {
        const unitData = getAvailableTimeUnits(filter.startDate, filter.endDate, units, options, locale, rounding);
        return unitData;
    }, [filter.startDate, filter.endDate]);

    if (timeUnits === null) return <></>;

    const width = timeUnits[Object.keys(timeUnits)[0]].reduce((acc, item) => acc + item.hours, 0) * xSize;
    const height = units.length * ySize;

    // OBS: HTML Elements fill up the DOM extremely quickly causing lag and performance issues.
    // OBS: Lazy Loading would only work until elements were loaded.
    // OBS: Virtualization batches scroll events causing "blinking" when scrolling.
    // OBS: Browsers have limits for the canvas area, hence why there is a limit on visible dates. This limit is controlled by available system memory and other factors.

    const draw = (renderer: CanvasRenderingContext2D, scrollOffsetX: number) => {

        console.log("drawing", width, xSize)

        // clear
        renderer.fillStyle = "#fff";
        renderer.fillRect(0, 0, width, height);

        // draw - OBS canvas calculates from the halfed pixel hence we add .5 many places
        renderer.lineWidth = 1;
        renderer.textBaseline = "bottom";
        renderer.textAlign = "left";
        renderer.font = `normal ${fontSize}px "Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",Arial,sans-serif`
        renderer.fillStyle = "#1f2937";

        for (const [idx, unit] of units.entries()) {
            const info = timeUnitInformation(unit);
            const rectHeight = idx * ySize;
            let x = 0;
            for (const [i, timeunit] of timeUnits[info.timeUnits].entries()) {
                const currentRectWidth = (timeunit.hours * xSize);

                // left line
                renderer.strokeStyle = "#9ca3af";
                renderer.setLineDash([1, 2]);
                if (i === 0) {
                    renderer.beginPath();
                    renderer.moveTo(x + .5, rectHeight);
                    renderer.lineTo(x + .5, rectHeight + ySize);
                    renderer.closePath();
                    renderer.stroke();
                }
                // right line
                renderer.beginPath();
                renderer.moveTo(x + currentRectWidth + .5, rectHeight);
                renderer.lineTo(x + currentRectWidth + .5, rectHeight + ySize);
                renderer.closePath();
                renderer.stroke();

                // top line
                renderer.strokeStyle = "#1f2937";
                renderer.setLineDash([0, 0]);
                if (idx === 0) {
                    renderer.beginPath();
                    renderer.moveTo(x, rectHeight + .5);
                    renderer.lineTo(x + currentRectWidth, rectHeight + .5);
                    renderer.closePath();
                    renderer.stroke();
                }
                renderer.beginPath();
                renderer.moveTo(x, rectHeight + .5 + ySize);
                renderer.lineTo(x + currentRectWidth, rectHeight + .5 + ySize);
                renderer.closePath();
                renderer.stroke();

                // text
                if (unit !== TimeUnit.Hour) {
                    const stickyX = Math.max(x, scrollOffsetX);
                    // no longer in rect
                    if (!(stickyX > x + currentRectWidth + .5 - 3.5)) renderer.fillText(timeunit.name, stickyX + 3.5, rectHeight - 1 + ySize);
                }

                x += currentRectWidth;
            }
        }
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) return;

        // initial draw
        draw(canvasContext, 0);
        // canvas.parentElement!.parentElement!.addEventListener("scroll", () => draw(canvasContext, canvas.parentElement!.parentElement!.scrollLeft));
        return () => canvas.parentElement!.parentElement!.removeEventListener('scroll', () => draw(canvasContext, canvas.parentElement!.parentElement!.scrollLeft));
    }, [])

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    )
}
