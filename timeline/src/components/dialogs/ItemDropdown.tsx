import * as React from 'react'
import { TimelineItem } from '../TimelineItem';
import { ActivityInformation } from '../../icons/Icon';
import { Badge, Button, Divider, Field, FluentProvider, Input, Persona, Popover, PopoverSurface, PopoverTrigger, Tag, TagGroup, webLightTheme } from '@fluentui/react-components';
import { DatePicker, DatePickerProps } from '@fluentui/react-datepicker-compat';
import { useTranslation } from 'react-i18next';
import { getIconClassName } from "@fluentui/style-utilities";
import { useCalendarInformation } from '../../../hooks/useCalendarInformation';
import { useGlobalGlobalContext } from '../../../contexts/global-context';
import { updateTimelineItem } from '../../services/odataService';
import { priorityColor, StateCodeName, StatusReasonName } from '../../util';
import { mapActivityToTimelineItem } from '../../services/dataLoader';
import { formatDateToTimeString, TimePicker, TimePickerProps } from '@fluentui/react-timepicker-compat';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import InlineFrameWindowDialog from './InlineFrameWindowDialog';


interface IItemDialogProps {
    children: any;
    item: TimelineItem;
}

export const ItemDropdown = ({ children, item }: IItemDialogProps) => {
    const { clientUrl, locale, options, timezone, itemDispatch } = useGlobalGlobalContext();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const dateCalendarInformation = useCalendarInformation();
    const itemRef = React.useRef<HTMLDivElement | null>(null);

    // important that scheduled date is UTC
    const [itemState, setItemState] = React.useState<TimelineItem>(item);

    // IMPOTANT i assume that format is HH:mm HH.mm with optional AM PM
    const timeRegex = /^(\d{1,2})[:.](\d{2})(?:\s*([AaPp][Mm]))?$/;
    
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
            const utcDate = fromZonedTime(date, timezone);
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
            const match = timeString.match(timeRegex);
            if (match) {
                let parsedHours = parseInt(match[1], 10);
                const parsedMinutes = parseInt(match[2], 10);
        
                // adjust if format is h12 or h11
                if ((options.hourCycle === 'h12' || options.hourCycle === 'h11') && match[3]) {
                    const dp = match[3].toLowerCase();
                    if (dp.startsWith('p') && parsedHours < 12) {
                        parsedHours += 12;
                    } else if (dp.startsWith('a') && parsedHours === 12) {
                        parsedHours = 0;
                    }
                }

                const currentDisplay = toZonedTime(itemState.scheduledend, timezone);

                currentDisplay.setHours(parsedHours, parsedMinutes);
                // convert updated displayed date back to UTC
                const newUtcDate = fromZonedTime(currentDisplay, timezone);
                setItemState({ ...itemState, scheduledend: newUtcDate });
            }
        }
    };

    const onTimePickerInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTimePickerValue(ev.target.value);
    };

    return (
        <Popover withArrow open={isOpen} onOpenChange={(_, open) => setIsOpen(open.open)}>
            <PopoverTrigger disableButtonEnhancement>{children}</PopoverTrigger>
            <PopoverSurface ref={itemRef} className="pointer-events-auto z-50" 
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}>
                <div className='flex flex-col'>
                {/* Information */}
                <div className='flex justify-between'>
                    <Persona 
                        name={item.ownerid?.name}
                        secondaryText={
                            <TagGroup>
                                <Tag size='extra-small' appearance='brand' role="list-item">{t(StateCodeName[item.statecode])}</Tag>
                                <Tag size='extra-small' appearance='brand'role="list-item">{t(StatusReasonName[item.statuscode])}</Tag>
                            </TagGroup>
                        }
                        presence={{ status: "unknown" }}
                    />
                    <div className='flex flex-col'>
                        <span className={`${getIconClassName("RingerSolid")} text-[12px] -rotate-45`} style={{ color: priorityColor[item.prioritycode] }} />
                        <InlineFrameWindowDialog item={item}>
                            <button className={`${getIconClassName("NavigateExternalInline")} text-[12px]`} />
                        </InlineFrameWindowDialog>
                    </div>
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
                        mountNode={itemRef.current}
                        size='small'
                        value={itemState.scheduledend}
                        appearance="filled-darker"
                        highlightSelectedMonth
                        showGoToToday
                        showCloseButton
                        contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                        calendar={dateCalendarInformation}
                        formatDate={(date) => date instanceof Date && date ? date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : ""}
                        onSelectDate={onSelectDate}
                    />
                </Field>
                <Field className='mt-2' size='small'>
                    <TimePicker 
                        mountNode={itemRef.current}
                        hourCycle={options.hourCycle}
                        expandIcon={<i className={`${getIconClassName("ChevronDown")} text-[11px]`} />}
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
