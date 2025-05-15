import { IInputs } from "../../generated/ManifestTypes";
import { IEntityReference, TimelineItem } from "../components/TimelineItem";
import { DEBUG } from "../Timeline";
import { StateCode, StatusReason } from "../util";

const loadDebugData = (): TimelineItem[] => {
  return [
    {
      id: "-1",
      subject: "UTC+01",
      activitytypecode: "appointment",
      scheduledend: new Date("2024-05-16T08:00:00.000+01:00"),
      prioritycode: 0,
      statecode: 0,
      statuscode: 1,
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    {
      id: "-10",
      subject: "UTC+01",
      activitytypecode: "milestone",
      scheduledend: new Date("2025-02-26T08:00:00.000+01:00"),
      prioritycode: 1,
      statecode: 0,
      statuscode: 2,
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    {
      id: "0",
      subject: "UTC+02",
      activitytypecode: "phonecall",
      scheduledend: new Date("2024-05-17T08:00:00.000+02:00"),
      prioritycode: 2,
      statecode: 1,
      statuscode: 3,
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    {
      id: "2",
      subject: "LOCAL",
      activitytypecode: "email",
      scheduledend: new Date("2024-05-18T08:00:00.000"),
      prioritycode: 1,
      statecode: 0,
      statuscode: 1,
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    {
      id: "1",
      subject: "Remember the chicken",
      activitytypecode: "task",
      scheduledend: new Date("2024-10-29"),
      prioritycode: 2,
      statecode: 0,
      statuscode: 2,
      ownerid: {
        id: "1",
        name: "Kaares Team",
        entitytype: "team",
      },
    },
    {
      id: "5",
      subject: "LOCAL",
      activitytypecode: "email",
      scheduledend: null,
      prioritycode: 1,
      statecode: 0,
      statuscode: 3,
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    {
      id: "12",
      subject: "LOCAL",
      activitytypecode: "email",
      scheduledend: null,
      prioritycode: 1,
      statecode: 1,
      statuscode: 4,
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    // {
    //     id: "2",
    //     name: "Another reminder",
    //     type: "task",
    //     date: new Date("2024-11-21T16:00:00.000Z"),
    // },
    // {
    //     id: "3",
    //     name: "What is this?",
    //     type: "task",
    //     date: new Date("2024-11-21T15:00:00.000Z"),
    // },
    // {
    //     id: "3S",
    //     name: "Estimated Close",
    //     type: "milestone",
    //     date: new Date("2024-11-17"),
    // },
    // {
    //     id: "4",
    //     name: "I am overlapping?",
    //     type: "appointment",
    //     date: new Date("2024-11-01T15:30:45Z"),
    //     owned: {
    //         id: "1",
    //         name: "SME",
    //         entitytype: "team"
    //     }
    // },
    // {
    //     id: "5",
    //     name: "Email",
    //     type: "email",
    //     date: new Date("2024-11-20T15:30:45Z"),
    //     owned: {
    //         id: "2",
    //         name: "Kaare",
    //         entitytype: "systemuser"
    //     }
    // },
    // {
    //     id: "6",
    //     name: "Phone Call",
    //     type: "phonecall",
    //     date: new Date("2024-11-20T15:30:45Z"),
    //     owned: {
    //         id: "3",
    //         name: "Børsting",
    //         entitytype: "systemuser"
    //     }
    // },
    // {
    //     id: "7",
    //     name: "Phone Call",
    //     type: "phonecall",
    //     date: new Date("2025-02-02T23:59:59Z"),
    //     owned: {
    //         id: "4",
    //         name: "Hello",
    //         entitytype: "systemuser"
    //     }
    // },
    // {
    //     id: "8",
    //     name: "Phone Call",
    //     type: "phonecall",
    //     date: null,
    //     owned: {
    //         id: "4",
    //         name: "Hello",
    //         entitytype: "systemuser"
    //     }
    // }
  ];
};

export const mapActivityToTimelineItem = (activity: any): any => {
  return {
    id: activity["activityid"],
    subject: activity["subject"],
    scheduledend: activity["scheduledend"] ? new Date(activity["scheduledend"]) : null
  };
}

const loadRealData = async (context: ComponentFramework.Context<IInputs>) => {
  const activities = context.parameters.activities.sortedRecordIds.map(
    (id: string): TimelineItem => {
      const activity = context.parameters.activities.records[id];
      const scheduledEnd =
        activity.getValue("scheduledend") === null
          ? null
          : new Date(activity.getValue("scheduledend") as string);

      const owner = {
        id: (activity.getValue("ownerid") as any).id.guid,
        name: (activity.getValue("ownerid") as any).name,
        entitytype: (activity.getValue("ownerid") as any).etn,
      } as IEntityReference;

      return {
        id: id,
        subject: activity.getValue("subject") as string,
        scheduledend: scheduledEnd,
        activitytypecode: activity.getValue("activitytypecode") as string,
        ownerid: owner,
        prioritycode: activity.getValue("prioritycode") as number,
        createdon: new Date(activity.getValue("createdon") as string),
        statecode: activity.getValue("statecode") as StateCode,
        statuscode: activity.getValue("statuscode") as StatusReason,
      };
    },
  );

  const result = await context.webAPI.retrieveRecord(
    (context.mode as any).contextInfo.entityTypeName,
    (context.mode as any).contextInfo.entityId,
  );
  const milestonesdate = context.parameters.milestonedata.raw ?? "{}";
  const milestones = JSON.parse(milestonesdate);
  for (const milestone of Object.keys(milestones)) {
    if (
      !result[milestone] ||
      result[milestone] === null ||
      result[milestone] === undefined
    )
      continue;
    const date = new Date(result[milestone]);
    activities.push({
      id: milestone,
      subject: milestones[milestone],
      activitytypecode: "milestone",
      scheduledend: date,
      prioritycode: 1,
      statecode: 0,
      statuscode: 1
    });
  }
  return activities;
};

export const loadData = async (
  context: ComponentFramework.Context<IInputs>,
): Promise<TimelineItem[]> => {
  return DEBUG ? loadDebugData() : await loadRealData(context);
};
