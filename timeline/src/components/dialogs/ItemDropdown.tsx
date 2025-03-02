import * as React from 'react'
import { TimelineItem } from '../TimelineItem';
import { ActivityInformation } from '../../icons/Icon';
import { Button, Field, FluentProvider, Input, Popover, PopoverSurface, PopoverTrigger, webLightTheme } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { useTranslation } from 'react-i18next';
import { getIconClassName } from "@fluentui/style-utilities";
import { useCalendarInformation } from '../../../hooks/useCalendarInformation';
import { useGlobalGlobalContext } from '../../../contexts/global-context';
import { updateTimelineItem } from '../../services/odataService';

interface IItemDialogProps {
    children: any;
    item: TimelineItem;
}

export const ItemDropdown = ({ children, item }: IItemDialogProps) => {
    
    const { clientUrl } = useGlobalGlobalContext();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    return (
        <FluentProvider theme={webLightTheme}>
            <Popover withArrow open={isOpen} onOpenChange={(_, open) => setIsOpen(open.open)}>
                <PopoverTrigger disableButtonEnhancement>{children}</PopoverTrigger>
                <PopoverSurface className="pointer-events-auto z-50" 
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}>
                    <div className='flex flex-col'>
                    {/* Name */}
                    <Field label={"Title"} size='small'>
                        <Input 
                            appearance='filled-darker'
                            value={item.subject}
                            onChange={(value) => {}}
                        />
                    </Field>
                    {/* Date */}
                    <Field label={"Date"} className='mt-2' size='small'>
                        <DatePicker 
                            size='small'
                            value={item.scheduledend}
                            appearance="filled-darker"
                            highlightSelectedMonth
                            showGoToToday
                            showCloseButton
                            contentAfter={<i className={`${getIconClassName("Calendar")} text-[11px]`} />}
                            // calendar={dateCalendarInformation}
                            onSelectDate={(date) => {}}
                        />
                    </Field>
                    {/* Actions */}
                    <div className='flex mt-2 w-full justify-between'>
                        <Button
                            size='small'
                            appearance="primary"
                            icon={<i className={`${getIconClassName("Save")} text-[11px]`} />}
                            onClick={async () => {
                                const updatedElement = await updateTimelineItem(clientUrl, item);
                                setIsOpen(false);
                                console.log(updatedElement)
                            }}>
                            {t("filter_save")}
                        </Button>
                        <Button
                            size='small'
                            onClick={() => {
                                setIsOpen(false);
                            }}>
                            {t("filter_cancel")}
                        </Button>
                    </div>
                </div>
                </PopoverSurface>
            </Popover>
        </FluentProvider>
    )
};
