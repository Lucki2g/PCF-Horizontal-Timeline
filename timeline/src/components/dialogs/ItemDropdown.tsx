import * as React from 'react'
import { TimelineItem } from '../TimelineItem';
import { ActivityInformation } from '../../icons/Icon';
import { Button, Divider, Field, FluentProvider, Input, Persona, Popover, PopoverSurface, PopoverTrigger, webLightTheme } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { useTranslation } from 'react-i18next';
import { getIconClassName } from "@fluentui/style-utilities";
import { useCalendarInformation } from '../../../hooks/useCalendarInformation';
import { useGlobalGlobalContext } from '../../../contexts/global-context';
import { updateTimelineItem } from '../../services/odataService';
import { priorityColor } from '../../util';

interface IItemDialogProps {
    children: any;
    item: TimelineItem;
}

export const ItemDropdown = ({ children, item }: IItemDialogProps) => {
    
    const { clientUrl, locale, itemDispatch } = useGlobalGlobalContext();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const dateCalendarInformation = useCalendarInformation();

    const [itemState, setItemState] = React.useState<TimelineItem>(item);

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
                        onSelectDate={(date) => setItemState({ ...itemState, scheduledend: date ?? null })}
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
                            itemDispatch(updatedElement);
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
