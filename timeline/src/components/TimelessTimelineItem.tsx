import * as React from 'react'
import Icon from '../icons/Icon';
import { TimelineItem } from './TimelineItem';
import { useGlobalDialogContext } from '../../contexts/dialog-context';
import { getHref } from '../util';
import { useGlobalGlobalContext } from '../../contexts/global-context';

export interface TimelessTimelineItemBlock {
    id: string;
    name: string;
    date: Date | null;
    type: string;
}

interface ITimelessTimelineItemProps {
    item: TimelineItem;
}

export default function TimelessTimelineItemBlock({ item }: ITimelessTimelineItemProps) {

    const { showDialog, hideDialog } = useGlobalDialogContext();
    const { clientUrl, activityInfo } = useGlobalGlobalContext();

    const openActivity = (): void => {
        const url = getHref(clientUrl, item.type, item.id);

        showDialog(
            <div className='flex flex-col'>
                <div className='flex justify-between m-1 p-2 rounded-[4px] shadow-dynamics'>
                    <div className='flex'></div>
                    <div className='flex'>
                        <button onClick={hideDialog} className='hover:bg-slate-100 duration-150 transition-colors bg-white rounded-md p-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" className='h-3.5 w-3.5'>
                                <path d="M1169 1024l879 879-145 145-879-879-879 879L0 1903l879-879L0 145 145 0l879 879L1903 0l145 145-879 879z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <iframe src={url} className='flex-grow w-full min-h-[540px]' />
            </div>, "w-11/12"
        );
    }

    return (
        <button onClick={openActivity} className={`group relative pointer-events-auto hover:cursor-pointer my-1 bg-white flex items-center shadow-dynamics border border-solid border-gray-300 overflow-hidden bottom-full justify-center rounded-[4px] px-1 py-[2px] origin-center`}>
            <span className='absolute left-0 w-1 h-full group-hover:w-full duration-300 transition-all' style={{ backgroundColor: activityInfo[item.type].color }}></span>
            <p className='whitespace-nowrap z-10 mx-1 text-xs group-hover:text-white transition-colors duration-300'>{item.name}</p>
            { item.type ? <Icon name={item.type} /> : <></> }
        </button>
    )
}
