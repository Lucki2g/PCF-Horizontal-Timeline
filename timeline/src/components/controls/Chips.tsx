import * as React from "react";
import { useGlobalGlobalContext } from "../../../contexts/global-context";
import {
  Field,
  InteractionTag,
  InteractionTagPrimary,
  TagGroup,
} from "@fluentui/react-components";

interface IChipsProps {
  label: string;
  states: { [key: string]: boolean };
  onChange: (key: string, state: boolean) => void;
}

export default function Chips({ label, states, onChange }: IChipsProps) {
  const { activityInfo } = useGlobalGlobalContext();

  return (
    <Field className="my-1 w-full" label={label} orientation="horizontal">
      <TagGroup size="small" style={{ display: "flex", flexWrap: "wrap" }}>
        {Object.keys(states).map((type) => {
          const data = activityInfo[type];

          return (
            <InteractionTag
              key={type}
              style={{
                borderStyle: "solid",
                borderColor: states[type] ? data.color : "#7E7E7E",
                borderWidth: "1px",
                position: "relative",
                margin: "2px 0",
              }}
              value={type}
              onClick={() => onChange(type, !states[type])}
            >
              <InteractionTagPrimary
                media={
                  <i
                    className={`material-symbols-rounded flex h-[20px] w-[20px] items-center justify-center rounded-[4px] text-[11px] text-white opacity-55`}
                    style={{
                      backgroundColor: states[type] ? data.color : "#7E7E7E",
                    }}
                  >
                    {data.icon}
                  </i>
                }
              >
                {type}
              </InteractionTagPrimary>
            </InteractionTag>
          );
        })}
      </TagGroup>
    </Field>
  );
}
