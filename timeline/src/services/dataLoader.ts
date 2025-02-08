import { IInputs } from "../../generated/ManifestTypes";
import { IEntityReference, TimelineItem } from "../components/TimelineItem";
import { DEBUG } from "../Timeline";

const loadDebugData = () => {
  return [
    {
      id: "-1",
      name: "UTC+01",
      type: "appointment",
      date: new Date("2024-05-16T08:00:00.000+01:00"),
      owned: {
          id: "2",
          name: "Kaare",
          entitytype: "systemuser"
      }
    },
    {
      id: "0",
      name: "UTC",
      type: "phonecall",
      date: new Date("2024-05-16T08:00:00.000+00:00"),
      owned: {
          id: "2",
          name: "Kaare",
          entitytype: "systemuser"
      }
    },
    {
      id: "2",
      name: "LOCAL",
      type: "email",
      date: new Date("2024-05-16T08:00:00.000"),
      owned: {
          id: "2",
          name: "Kaare",
          entitytype: "systemuser"
      }
    },
    {
      id: "1",
      name: "Remember the chicken",
      type: "task",
      date: new Date("2024-10-29"),
      owned: {
          id: "1",
          name: "Kaares Team",
          entitytype: "team"
      }
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
        name: activity.getValue("name") as string,
        date: scheduledEnd,
        type: activity.getValue("activitytypecode") as string,
        owned: owner,
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
      name: milestones[milestone],
      type: "milestone",
      date: date,
    });
  }
  return activities;
};

export const loadData = async (
  context: ComponentFramework.Context<IInputs>,
): Promise<TimelineItem[]> => {
  return DEBUG ? loadDebugData() : await loadRealData(context);
};
