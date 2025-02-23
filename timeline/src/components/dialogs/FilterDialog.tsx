import { Badge, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, DialogTriggerChildProps, Divider, Field, Text, Title2, Title3, Tooltip } from '@fluentui/react-components'
import * as React from 'react'
import Search from '../controls/Search';
import { useTranslation } from 'react-i18next';
import { FilterState, useFilter } from '../../../contexts/filter-context';
import { IEntityReference, TimelineItem } from '../TimelineItem';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { ARIAButtonType } from '@fluentui/react-aria';
import Chips from '../controls/Chips';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import Lookup from '../controls/Lookup';

interface IFilterDialogProps {
    items: TimelineItem[];
    childElement: React.ReactElement<DialogTriggerChildProps>;
    onSave: (filter: FilterState) => void;
}

export const FilterDialog = ({ items, childElement, onSave }: IFilterDialogProps) => {

    const { t } = useTranslation();
    const { initialState, filter, filterItems } = useFilter();
    const rootElement = React.useRef(null);
    
    const [currentFilter, setCurrentFilter] = React.useState<FilterState>(filter);
    const [filteredActivities, setFilteredActivities] = React.useState<number>();

    React.useEffect(() => {
    setFilteredActivities(filterItems(currentFilter, items).length);
    }, [currentFilter]);
    
    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                {childElement}
            </DialogTrigger>
            <DialogSurface>
                <DialogBody ref={rootElement}>
                    {/* HEADER */}
                    <DialogTitle role="heading">
                        <div className='w-full flex justify-between items-start'>
                            <div className='flex flex-col items-start'>
                                <Title3 role="h2" className=''>{t("filter_title")}</Title3>
                                <Text role="p">{t("filter_count")
                                    .replace("{0}", "" + filteredActivities)
                                    .replace("{1}", "" + items.length)}</Text>
                            </div>
                            <Tooltip content={"clear filter"} relationship='label' withArrow>
                                <Button style={{ position: "relative" }} shape='rounded' appearance='secondary' onClick={() => setCurrentFilter(initialState)} icon={<FontIcon iconName='ClearFilter' />}/>
                            </Tooltip>
                        </div>
                    </DialogTitle>

                    {/* BODY */}
                    <DialogContent>
                        {/* SEARCH */}
                        <Divider appearance='strong' />
                        <Search
                            label={t("filter_search")}
                            value={currentFilter.search}
                            onChange={(value) =>
                                setCurrentFilter({ ...currentFilter, search: value })
                            }
                        />
                        {/* TYPE TOGGLES */}
                        <Divider appearance='subtle' />
                        <Chips
                            label={t("filter_activitytypes")}
                            states={currentFilter.itemTypes}
                            onChange={(type: string, state: boolean) => {
                                console.log(type, "changed to", state)
                                setCurrentFilter({
                                ...currentFilter,
                                itemTypes: { ...currentFilter.itemTypes, [type]: state },
                                })
                            }
                        }/>
                        {/* DATE INTERVAL */}
                        <Divider appearance='subtle' />
                        <Field label={t("filter_startdate")} orientation="horizontal" className="w-full my-1">
                            <DatePicker 
                                mountNode={rootElement.current}
                                value={currentFilter.startDate} 
                                appearance="filled-darker"
                                highlightSelectedMonth 
                                showGoToToday 
                                showCloseButton
                                onSelectDate={(date) => setCurrentFilter({...currentFilter, startDate: (date && date !== null) ? date : initialState.startDate})}
                                minDate={initialState.startDate}
                                maxDate={initialState.endDate}
                                // calendar={
                                //   highlightSelectedMonth: true
                                //   dateTimeFormatter: 
                                // }
                                // strings={
                
                                // }
                            />
                            </Field>
                            <Field label={t("filter_enddate")}orientation="horizontal" className="w-full my-1">
                            <DatePicker value={currentFilter.endDate} 
                                mountNode={rootElement.current}
                                appearance="filled-darker"
                                highlightSelectedMonth 
                                showGoToToday 
                                showCloseButton
                                onSelectDate={(date) => setCurrentFilter({...currentFilter, endDate: (date && date !== null) ? date : initialState.endDate})}
                                minDate={initialState.startDate}
                                maxDate={initialState.endDate}
                                // strings={
                
                                // }
                                // calendar={
                                //   dateTimeFormatter: 
                                // }
                            />
                        </Field>
                        {/* OWNER */}
                        <Divider appearance='subtle' />
                        <Lookup
                            label={t("filter_owner")}
                            handleChange={(newValue: IEntityReference | null) =>
                                setCurrentFilter({ ...currentFilter, owner: newValue })
                            }
                            currentValue={currentFilter.owner}
                            options={items
                                .filter((i) => i.owned && i.owned !== null)
                                .map((i) => i.owned!)}
                        />
                        {/* BUTTONS */}
                        <Divider appearance='strong' />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance='primary' icon={<FontIcon iconName='Save' />} onClick={() => onSave(currentFilter)}>{t("filter_save")}</Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button>{t("filter_close")}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
};
