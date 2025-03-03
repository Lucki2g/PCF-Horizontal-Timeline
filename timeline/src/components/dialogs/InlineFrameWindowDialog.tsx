import * as React from 'react'
import { TimelineItem } from '../TimelineItem';
import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, DialogTriggerChildProps, FluentProvider, Toolbar, webLightTheme } from '@fluentui/react-components';
import { getIconClassName } from "@fluentui/style-utilities";
import { ActivityInformation } from '../../icons/Icon';
import { useGlobalGlobalContext } from '../../../contexts/global-context';
import { getHref } from '../../util';

interface IItemDialogProps {
    children: any;
    item: TimelineItem;
}

export default function InlineFrameWindowDialog({ item, children }: IItemDialogProps) {

    const { clientUrl, activityInfo } = useGlobalGlobalContext();
    const url = getHref(clientUrl, item.activitytypecode, item.id);

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>{children}</DialogTrigger>
            <DialogSurface style={{ maxWidth: "fit-content" }}>
                <DialogBody>
                    <DialogTitle role="heading">
                        <div className='flex items-center'>
                            <Avatar className='mr-4' shape='square' size={48} icon={<i className={`${getIconClassName(activityInfo[item.activitytypecode].icon)}`} />}  />
                            {item.subject}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <iframe src={url} className="min-h-[680px] w-[1080px] flex-grow" />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance='primary'>
                                Close
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
}
