import * as React from 'react'
import { ActivityTypeOptions, getActivityInformation } from '../icons/Icon';
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import { useTranslation } from 'react-i18next';
import { getIcon, hexToRgb } from '../util';
import { IEntityReference, TimelineItem } from './TimelineItem';
import { FilterState, useFilter } from '../../contexts/filter-context';
import { DatePicker } from '@mantine/dates';
import { AnimatePresence, motion } from 'framer-motion';
import Lookup from './controls/Lookup';

interface IFilterDialogProps {
    items: TimelineItem[];
    locale: string;
    onSave: (filter: FilterState) => void;
}

export default function FilterDialog({ locale, items, onSave }: IFilterDialogProps) {

    const { hideDialog } = useGlobalDialogContext();
    const { initialState, filter, filterItems } = useFilter();
    const { t } = useTranslation();

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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" className='w-4 h-4 m-1 fill-sky-600'>
                        <path d="M0 128h2048v219l-768 768v805H768v-805L0 347V128zm1920 165v-37H128v37l768 768v731h256v-731l768-768zm37 987l91 91-230 229 230 229-91 91-229-230-229 230-91-91 230-229-230-229 91-91 229 230 229-230z"></path>
                    </svg>
                </button>
            </div>

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* SEARCH */}
            <div className='my-2 w-full flex-col'>
                <p className='text-start text-xs font-semibold text-gray-500 tracking-wide mb-1'>{t("filter_search")}:</p>
                <div className='relative w-full'>
                    <input 
                    value={currentFilter.search} 
                    onChange={(e) => setCurrentFilter({ ...currentFilter, search: e.target.value })} 
                    type='text' 
                    tabIndex={1}
                    className='w-full box-border border-solid bg-neutral-100 focus:outline-none peer p-1 rounded-[4px]'></input>
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-sky-600 transition-all duration-300 transform -translate-x-1/2 peer-focus:w-full peer-focus:transform-origin-center rounded-b-[4px]"></div>
                </div>
            </div>

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* TYPE TOGGLES */}
            <div className='my-1 w-full flex flex-col text-xs'>
                <p className='text-start text-xs font-semibold text-gray-500 tracking-wide mb-1'>{t("filter_activitytypes")}:</p>
                <div className='flex flex-wrap justify-center'>{
                    ActivityTypeOptions.map((type) => {
                        const styleInformation = getActivityInformation(type);

                        return (
                            <div key={type} className="flex justify-end items-center my-px">
                                <input
                                    type="checkbox"
                                    id={type}
                                    tabIndex={1}
                                    className="hidden peer"
                                    checked={!!currentFilter.itemTypes[type]}
                                    onChange={() => setCurrentFilter({ ...currentFilter, itemTypes: { ...currentFilter.itemTypes, [type]: !currentFilter.itemTypes[type] }})}
                                />
                                <div className={`flex items-center justify-center rounded-full mx-1 my-px px-2 py-0.5 bg-opacity-20 cursor-pointer border-solid border select-none
                                peer-checked:shadow-dynamics hover:shadow-dynamics transition-all duration-300`} onClick={() => setCurrentFilter({ ...currentFilter, itemTypes: { ...currentFilter.itemTypes, [type]: !currentFilter.itemTypes[type] }})} 
                                    style={{
                                        borderColor: currentFilter.itemTypes[type] ? styleInformation.color : "#9ca3af",
                                        backgroundColor: currentFilter.itemTypes[type] ? `rgba(${hexToRgb(styleInformation.color)}, 0.2)` : `rgba(${hexToRgb("#9ca3af")}, 0.2)`,
                                    }}>
                                    <AnimatePresence exitBeforeEnter>
                                        {
                                            currentFilter.itemTypes[type] ?
                                            <motion.svg 
                                                key={("svg-" + type)}
                                                initial={{ width: 0 }}
                                                animate={{ width: 12 }}
                                                exit={{ width: 0 }}
                                                transition={{ duration: 0.3 }}
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 2048 2048" 
                                                className="h-3 pointer-events-none mr-1" 
                                                style={{ fill: currentFilter.itemTypes[type] ? styleInformation.color : "#9ca3af" }}>
                                                <path d="M640 1755L19 1133l90-90 531 530L1939 275l90 90L640 1755z"></path>
                                            </motion.svg> :
                                            <></>
                                        }
                                    </AnimatePresence>
                                    <label htmlFor={type} className="peer-checked:font-bold pointer-events-none" style={{ color: currentFilter.itemTypes[type] ? styleInformation.color : "#9ca3af" }}>
                                        {t(type)}
                                    </label>
                                </div>
                            </div>
                        );
                    })
                }
                </div>
            </div>

            <div className='h-px w-full bg-gray-800 my-1 bg-opacity-10' />

            {/* DATE INTERVAL */}
            {/* https://mantine.dev/dates/date-picker/ */}
            
            <div className='my-2 w-full flex-col'>
                <p className='text-start text-xs font-semibold text-gray-500 tracking-wide mb-1'>{t("filter_dates")}:</p>
                <div className='flex item-center flex-wrap'>
                    <div className='flex flex-col'>
                        <div className='flex w-full mb-2'>
                            <p className='text-start text-xs text-gray-500 tracking-wide pr-1'>{t("filter_startdate")}:</p>
                            <p className='text-xs font-semibold'>{currentFilter.startDate.toLocaleString(locale, { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
                        </div>
                        <DatePicker locale={locale} minDate={initialState.startDate} maxDate={initialState.endDate} size='xs' defaultLevel="decade" onChange={(val) => setCurrentFilter({ ...currentFilter, startDate: val ?? initialState.startDate })} value={currentFilter.startDate} />
                    </div>
                        
                    <div className='flex flex-col'>
                        <div className='flex w-full mb-2'>
                            <p className='text-start text-xs text-gray-500 tracking-wide pr-1'>{t("filter_enddate")}:</p>
                            <p className='text-xs font-semibold'>{currentFilter.endDate.toLocaleString(locale, { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
                        </div>
                        <DatePicker locale={locale} minDate={initialState.startDate} maxDate={initialState.endDate} size='xs' defaultLevel="decade" onChange={(val) => setCurrentFilter({ ...currentFilter, endDate: val ?? initialState.endDate })} value={currentFilter.endDate} />
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" className='w-3.5 h-3.5 mr-1 fill-sky-600 group-hover:fill-white duration-200 transition-colors'>
                        <path d="M1792 128q27 0 50 10t40 27 28 41 10 50v1664H357l-229-230V256q0-27 10-50t27-30 41-28 50-10h1536zM512 896h1024V256H512v640zm768 512H640v384h128v-256h128v256h384v-384zm512-1152h-128v768H384V256H256v1381l154 155h102v-512h896v512h384V256z"></path>
                    </svg>
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
