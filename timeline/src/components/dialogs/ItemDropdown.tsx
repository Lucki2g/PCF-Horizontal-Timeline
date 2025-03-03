import * as React from 'react'
import { TimelineItem } from '../TimelineItem';
import { ActivityInformation } from '../../icons/Icon';
import { Button, Divider, Field, FluentProvider, Input, Persona, Popover, PopoverSurface, PopoverTrigger, webLightTheme } from '@fluentui/react-components';
import { DatePicker, DatePickerProps } from '@fluentui/react-datepicker-compat';
import { useTranslation } from 'react-i18next';
import { getIconClassName } from "@fluentui/style-utilities";
import { useCalendarInformation } from '../../../hooks/useCalendarInformation';
import { useGlobalGlobalContext } from '../../../contexts/global-context';
import { updateTimelineItem } from '../../services/odataService';
import { priorityColor } from '../../util';
import { mapActivityToTimelineItem } from '../../services/dataLoader';
import { formatDateToTimeString, TimePicker, TimePickerProps } from '@fluentui/react-timepicker-compat';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';


interface IItemDialogProps {
    children: any;
    item: TimelineItem;
}

export const ItemDropdown = ({ children, item }: IItemDialogProps) => {
    const { clientUrl, locale, options, timezone, itemDispatch } = useGlobalGlobalContext();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const dateCalendarInformation = useCalendarInformation();

    // important that scheduled date is UTC
    const [itemState, setItemState] = React.useState<TimelineItem>(item);
    
    // converts the date to the timezone for when displs
    const displayDate = itemState.scheduledend ? toZonedTime(itemState.scheduledend, timezone) : null;
    // timepicker needs some extra love :)
    const [timePickerValue, setTimePickerValue] = React.useState<string>(
        displayDate
            ? displayDate.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: options.hourCycle,
                timeZone: timezone,
            })
            : ""
    );

    // new dates to be converted from timezone (user probvabliy) to UTC
    const onSelectDate: DatePickerProps["onSelectDate"] = (date) => {
        if (date) {
        let utcDate = fromZonedTime(date, timezone);
        // perserve date timelement
        if (itemState.scheduledend) {
            const currentDisplay = toZonedTime(itemState.scheduledend, timezone);
            utcDate.setHours(currentDisplay.getHours(), currentDisplay.getMinutes(), currentDisplay.getSeconds());
        }
            setItemState({ ...itemState, scheduledend: utcDate });
        } else {
            setItemState({ ...itemState, scheduledend: null });
        }
    };


    // update time element of date.
    const onTimeChange: TimePickerProps["onTimeChange"] = (_ev, data) => {
        const timeString = data.selectedTimeText;
        setTimePickerValue(timeString ?? "");

        if (timeString && itemState.scheduledend) {
            const currentDisplay = toZonedTime(itemState.scheduledend, timezone);
            // important! I assume choice is in format hh:mm. TODO if sec needs supported
            const [hours, minutes] = timeString.split(':').map(Number);
            currentDisplay.setHours(hours, minutes);
            // convert updated displayed date back to UTC
            const newUtcDate = fromZonedTime(currentDisplay, timezone);
            setItemState({ ...itemState, scheduledend: newUtcDate });
        }
    };

    const onTimePickerInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTimePickerValue(ev.target.value);
    };

    return (
        <Popover withArrow open={isOpen} onOpenChange={(_, open) => setIsOpen(open.open)}>
            <PopoverTrigger disableButtonEnhancement>{children}</PopoverTrigger>
            <PopoverSurface className="pointer-events-auto z-50" 
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}>
                <div className='flex flex-col'>
                {/* Information */}
                <div className='flex justify-between'>
                    <Persona 
                        name={item.ownerid?.name}
                        secondaryText={t(item.activitytypecode)}
                        presence={{ status: "unknown" }}
                    />
                    <span className={`${getIconClassName("RingerSolid")} text-[12px] -rotate-45`} style={{ color: priorityColor[item.prioritycode] }} />
                </div>
                <Divider className='my-2' />
                {/* Name */}
                <Field label={t("dropdown_title")} size='small'>
                    <Input 
                        appearance='filled-darker'
                        value={itemState.subject}
                        onChange={(_, value) => setItemState({ ...itemState, subject: value.value })}
                    />
                </Field>
                {/* Date */}
                <Field label={t("dropdown_date")} className='mt-2' size='small'>
                    <DatePicker 
                        size='small'
                        value={itemState.scheduledend}
                        appearance="filled-darker"
                        highlightSelectedMonth
                        showGoToToday
                        showCloseButton
                        contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                        calendar={dateCalendarInformation}
                        formatDate={(date) => date?.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) ?? ""}
                        onSelectDate={onSelectDate}
                    />
                </Field>
                <Field className='mt-2' size='small'>
                    <TimePicker 
                        hourCycle={options.hourCycle}
                        size='small'
                        appearance='filled-darker'
                        freeform
                        dateAnchor={displayDate ?? undefined}
                        selectedTime={displayDate ?? undefined}
                        value={timePickerValue}
                        onTimeChange={onTimeChange}
                        onInput={onTimePickerInput}
                    />
                </Field>
                <Divider className='my-2' />
                {/* Actions */}
                <div className='flex w-full justify-between'>
                    <Button
                        size='small'
                        appearance="primary"
                        icon={<i className={`${getIconClassName("Save")} text-[11px]`} />}
                        onClick={async () => {
                            const updatedElement = await updateTimelineItem(clientUrl, itemState);
                            setIsOpen(false);
                            itemDispatch({ type: "update", payload: mapActivityToTimelineItem(updatedElement) });
                        }}>
                        {t("dropdown_save")}
                    </Button>
                    <Button
                        size='small'
                        onClick={() => {
                            setIsOpen(false);
                        }}>
                        {t("dropdown_close")}
                    </Button>
                </div>
            </div>
            </PopoverSurface>
        </Popover>
    )
};
