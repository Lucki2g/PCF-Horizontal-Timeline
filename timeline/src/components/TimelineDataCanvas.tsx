import * as React from 'react'
import { IInputs } from '../../generated/ManifestTypes';
import { getAvailableTimeUnits, TimeUnit, TimeUnits, ySize } from '../timeUtil';
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

    const { t } = useTranslation();
    const { filter } = useFilter();
    
    const timeUnits = React.useMemo<TimeUnits>(() => {
        const unitData = getAvailableTimeUnits(filter.startDate, filter.endDate, units, options, locale, rounding);
        return unitData;
    }, [filter.startDate, filter.endDate]);

    const draw = (context: CanvasRenderingContext2D) => {

    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) return;
        draw(canvasContext);
    }, [])

    return (
        <canvas ref={canvasRef} width={context.mode.allocatedWidth} height={units.length * ySize} />
    )
}
