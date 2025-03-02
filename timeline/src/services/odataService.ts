import { TimelineItem } from "../components/TimelineItem";

const apiVersion = "v9.2";

// in order to support both canvasapp, custompage and modeldriven I make calls diractly to the API instead of using the modeldriven SDK.
export const updateTimelineItem = async (url: string, item: TimelineItem) => {

    console.log("calling on item: ", item)

    const organizationUrl = url;
    const entityLogicalName = item.activitytypecode;
    const entityId = item.id;

    const dataObject: any = {
        subject: item.subject,
        scheduledend: item.scheduledend,
        activitytypecode: item.activitytypecode,
        prioritycode: item.prioritycode
    }

    if (item.ownerid && item.ownerid !== null) {
        item.ownerid.entitytype === "systemuser" 
        ? dataObject["ownerid@odata.bind"] = `/systemusers(${item.ownerid?.id})`
        : dataObject["ownerid@odata.bind"] = `/teams(${item.ownerid?.id})`
    }

    const endpoint = `${organizationUrl}/api/data/${apiVersion}/${entityLogicalName}(${entityId})`

    return await fetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify(dataObject)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error updating record: ${response.status} ${response.statusText}`);
        return response.json();
    })
    .catch(error => {
        console.error("Error updating record:", error);
    })
}