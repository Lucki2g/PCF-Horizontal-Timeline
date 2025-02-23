import * as React from "react";
import { useGlobalGlobalContext } from "../../../contexts/global-context";
import { Field, InteractionTag, InteractionTagPrimary, TagGroup } from "@fluentui/react-components";
import { getIconClassName } from "@fluentui/style-utilities"

interface IChipsProps {
  label: string;
  states: { [key: string]: boolean };
  onChange: (key: string, state: boolean) => void;
}

export default function Chips({ label, states, onChange }: IChipsProps) {
  const { activityInfo } = useGlobalGlobalContext();

  return (
    <Field className="w-full my-1" label={label} orientation="horizontal">
      <TagGroup size="small" style={{ display: "flex", flexWrap: "wrap" }}>
        {Object.keys(states).map((type) => {
          const data = activityInfo[type];

          return (
              <InteractionTag key={type} style={{ borderStyle: "solid", borderColor: states[type] ? data.color : "#7E7E7E", borderWidth: "1px", position: "relative", margin: "2px 0" }} value={type} onClick={() => onChange(type, !states[type])}>
                <InteractionTagPrimary media={
                    <i className={`${getIconClassName(data.icon)} text-[11px] w-[20px] h-[20px] flex items-center justify-center rounded-[4px] text-white opacity-55`} style={{ backgroundColor: states[type] ? data.color : "#7E7E7E" }} />}>
                  {type}
                </InteractionTagPrimary>
              </InteractionTag>)
        })}
      </TagGroup>
    </Field>)
}