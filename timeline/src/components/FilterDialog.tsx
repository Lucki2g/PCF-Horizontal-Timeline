import * as React from 'react'
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import { useTranslation } from 'react-i18next';
import { IEntityReference, TimelineItem } from './TimelineItem';
import { FilterState, useFilter } from '../../contexts/filter-context';
import { DatePicker } from '@mantine/dates';
import Lookup from './controls/Lookup';
import Search from './controls/Search';
import Chips from './controls/Chips';
import { useGlobalGlobalContext } from '../../contexts/global-context';
import { FilterX, Save } from 'lucide-react';

interface IFilterDialogProps {
    items: TimelineItem[];
    onSave: (filter: FilterState) => void;
}

export default function FilterDialog({ items, onSave }: IFilterDialogProps) {

    const { hideDialog } = useGlobalDialogContext();
    const { initialState, filter, filterItems } = useFilter();
    const { t } = useTranslation();
    const { locale, activityInfo } = useGlobalGlobalContext();

    const [currentFilter, setCurrentFilter] = React.useState<FilterState>(filter);
    const [filteredActivities, setFilteredActivities] = React.useState<number>();

    React.useEffect(() => {
        setFilteredActivities(filterItems(currentFilter, items).length);
    }, [currentFilter]);

    return (
        <div className='flex flex-col items-start justify-start m-2 w-full'>

            {/* HEADER */}
            <div className='flex justify-between items-center w-full mb-8'>
                <div className='flex flex-col'>
                    <h1 className='font-semibold'>{t("filter_title")}</h1>
                    <p className='text-sm'>{t("filter_count").replace("{0}", "" + filteredActivities).replace("{1}", "" + items.length)}</p>
                </div>
                <button className='rounded-full transition-colors bg-sky-50 hover:bg-sky-200 mr-2 duration-300 p-2' onClick={() => setCurrentFilter(initialState)}>
                    <FilterX size={48} strokeWidth={1.5} absoluteStrokeWidth color='#0284c7' />
                </button>
            </div>

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* SEARCH */}
            <Search label={t("filter_search")} value={currentFilter.search} onChange={(value) => setCurrentFilter({ ...currentFilter, search: value })} />

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* TYPE TOGGLES */}
            <Chips label={t("filter_activitytypes")} states={currentFilter.itemTypes} onChange={(type: string, state: boolean) => setCurrentFilter({ ...currentFilter, itemTypes: { ...currentFilter.itemTypes, [type]: state } })} />

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* DATE INTERVAL */}
            {/* https://mantine.dev/dates/date-picker/ */}
            <div className='my-2 w-full flex-col bg-neutral-100 rounded-[4px] p-2 pt-5 relative'>
                <p className='absolute top-0.5 left-2 text-start text-xs font-semibold text-gray-500 tracking-wide'>{t("filter_dates")}</p>
                <div className='flex justify-center items-center flex-wrap'>
                    <div className='flex flex-col mx-1'>
                        <div className='flex w-full my-1'>
                            <p className='text-start text-xs text-gray-500 tracking-wide pr-1'>{t("filter_startdate")}:</p>
                            <p className='text-xs font-semibold'>{currentFilter.startDate.toLocaleString(locale, { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
                        </div>
                        <DatePicker className="p-2 bg-white rounded-[4px]" locale={locale} minDate={initialState.startDate} maxDate={initialState.endDate} size='xs' defaultLevel="decade" onChange={(val) => setCurrentFilter({ ...currentFilter, startDate: val ?? initialState.startDate })} value={currentFilter.startDate} />
                    </div>
                        
                    <div className='flex flex-col mx-1'>
                        <div className='flex w-full my-1'>
                            <p className='text-start text-xs text-gray-500 tracking-wide pr-1'>{t("filter_enddate")}:</p>
                            <p className='text-xs font-semibold'>{currentFilter.endDate.toLocaleString(locale, { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
                        </div>
                        <DatePicker className="p-2 bg-white rounded-[4px]" locale={locale} minDate={initialState.startDate} maxDate={initialState.endDate} size='xs' defaultLevel="decade" onChange={(val) => setCurrentFilter({ ...currentFilter, endDate: val ?? initialState.endDate })} value={currentFilter.endDate} />
                    </div>
                </div>
            </div>

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* OWNER */}
            <Lookup 
                label={t("filter_owner")} 
                handleChange={
                    (newValue: IEntityReference | null) => 
                    setCurrentFilter({ ...currentFilter, owner: newValue })
                } 
                currentValue={currentFilter.owner} 
                options={items.filter(i => i.owned && i.owned !== null).map(i => i.owned!)} />

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* BUTTONS */}
            <div className='flex w-full justify-center text-sm mt-8'>
                {/* SAVE */}
                <button onClick={() => { hideDialog(); onSave(currentFilter) }} className='rounded-[4px] mx-1 py-2 px-4 font-semibold flex items-center hover:text-white text-sky-600 bg-sky-200 hover:bg-sky-300 duration-200 transition-colors group'>
                    <Save size={48} strokeWidth={1.5} absoluteStrokeWidth color='#0284c7' />
                    {t("filter_save")}
                </button>

                {/* CLOSE */}
                <button onClick={() => {hideDialog()}} className='rounded-[4px] mx-1 py-2 px-4 font-semibold flex items-center hover:text-white text-gray-600 bg-gray-200 hover:bg-gray-300 duration-200 transition-colors'>
                    {t("filter_close")}
                </button>
            </div>
        </div>
    )
}
