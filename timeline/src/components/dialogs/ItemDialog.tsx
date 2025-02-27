import * as React from 'react'
import { TimelineItem } from '../TimelineItem';
import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, DialogTriggerChildProps, FluentProvider, Toolbar, webLightTheme } from '@fluentui/react-components';
import { getIconClassName } from "@fluentui/style-utilities";
import { ActivityInformation } from '../../icons/Icon';

interface IItemDialogProps {
    item: TimelineItem;
    info: ActivityInformation;
    url: string;
    triggerElement: React.ReactElement<DialogTriggerChildProps>;
}

export default function ItemDialog({ item, info, url, triggerElement }: IItemDialogProps) {
    return (
        // a bit supid to have a secondary fluent provider but this element is portaled outside the other one for some reason
        <FluentProvider theme={webLightTheme}>
            <Dialog>
                <DialogTrigger disableButtonEnhancement>{triggerElement}</DialogTrigger>
                <DialogSurface style={{ maxWidth: "fit-content" }}>
                    <DialogBody>
                        <DialogTitle role="heading">
                            <div className='flex items-center'>
                                <Avatar className='mr-4' shape='square' size={48} icon={<i className={`${getIconClassName(info.icon)}`} />} style={{ backgroundColor: info.color }}  />
                                {item.name}
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
        </FluentProvider>
    )
}
