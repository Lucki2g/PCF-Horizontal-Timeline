import { IInputs } from "../../generated/ManifestTypes";
import { IEntityReference, TimelineItem } from "../components/TimelineItem";
import { DEBUG } from "../Timeline";

const loadDebugData = () => {
  return [
    {
      id: "-1",
      subject: "UTC+01",
      activitytypecode: "appointment",
      scheduledend: new Date("2024-05-16T08:00:00.000+01:00"),
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
      ownerid: {
        id: "2",
        name: "Kaare",
        entitytype: "systemuser",
      },
    },
    {
      id: "0",
      subject: "UTC",
      activitytypecode: "phonecall",
      scheduledend: new Date("2024-05-16T08:00:00.000+00:00"),
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
      scheduledend: new Date("2024-05-16T08:00:00.000"),
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
        prioritycode: activity.getValue("prioritycode") as string,
        createdon: new Date(activity.getValue("createdon") as string)
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
    });
  }
  return activities;
};

export const loadData = async (
  context: ComponentFramework.Context<IInputs>,
): Promise<TimelineItem[]> => {
  return DEBUG ? loadDebugData() : await loadRealData(context);
};
