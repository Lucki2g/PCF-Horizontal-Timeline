import * as React from "react";
import { hexToRgb } from "../../util";
import { useGlobalGlobalContext } from "../../../contexts/global-context";

interface IChipsProps {
  label: string;
  states: { [key: string]: boolean };
  onChange: (key: string, state: boolean) => void;
}

export default function Chips({ label, states, onChange }: IChipsProps) {
  const { activityInfo } = useGlobalGlobalContext();

  return (
    <div className="my-1 flex w-full flex-col text-xs">
      <div className="relative flex flex-wrap justify-start rounded-[4px] bg-neutral-100 p-2 pt-5">
        {Object.keys(states).map((type) => {
          return (
            <Chip
              key={type}
              label={type}
              color={activityInfo[type].color}
              active={states[type]}
              onClicked={(state: boolean) => onChange(type, state)}
            />
          );
        })}
        <p className="absolute left-2 top-0.5 text-start text-xs font-semibold tracking-wide text-gray-500">
          {label}
        </p>
      </div>
    </div>
  );
}

interface IChipProps {
  label: string;
  color: string;
  active: boolean;
  onClicked: (state: boolean) => void;
}

function Chip({ label, color, active, onClicked }: IChipProps) {
  return (
    <div className="my-px flex items-center justify-end">
      <input
        type="checkbox"
        id={label}
        tabIndex={1}
        className="peer hidden"
        checked={active}
      />
      <div
        className={`mr-1 cursor-pointer select-none rounded-[4px] border border-solid bg-opacity-30 px-2 py-0.5 shadow-dynamics transition-colors duration-150`}
        style={{
          color: active ? color : "#6b7280",
          borderColor: active ? color : "#6b7280",
          backgroundColor: active
            ? `rgba(${hexToRgb(color)}, 0.15)`
            : `rgba(${hexToRgb("#6b7280")}, 0.15)`,
        }}
        onClick={() => onClicked(!active)}
      >
        <label htmlFor={label} className="pointer-events-none text-xs">
          {label}
        </label>
      </div>
    </div>
  );
}
