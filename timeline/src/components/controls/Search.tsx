import * as React from "react";
import { useGlobalGlobalContext } from "../../../contexts/global-context";
import { Input, Label } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

interface ISearchProps {
  label: string;
  value: string;
  description?: string;
  onChange: (value: string) => void;
}

export default function Search({
  label,
  value,
  description,
  onChange,
}: ISearchProps) {
  const [focused, setFocused] = React.useState<boolean>(false);

  const { useFluent } = useGlobalGlobalContext();

  return (
    <>
    {
      useFluent ?
      <div className="flex w-full justify-between items-center">
        <Label className="w-[150px]" htmlFor={"search_field"}>{label}</Label>
        <Input 
          type="text" 
          appearance="filled-darker" 
          id={"search_field"} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full"
        />
      </div> :
      <div className="my-2 w-full flex-col">
        <div className="relative my-1 w-full">
          <input
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            type="text"
            tabIndex={1}
            className="peer box-border w-full rounded-[4px] border-solid bg-neutral-100 p-2 pt-5 text-sm focus:outline-none"
          ></input>
          <label
            className={`absolute left-2 text-start font-semibold tracking-wide text-gray-500 transition-all duration-150 peer-focus:text-cyan-400 ${focused || value.length > 0 ? "text-xs" : "text-sm"}`}
            style={{ top: focused || value.length > 0 ? "2px" : "14px" }}
          >
            {label}
          </label>
          <div className="peer-focus:transform-origin-center absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform rounded-b-[4px] bg-gradient-to-r from-cyan-400 to-sky-600 transition-all duration-300 peer-focus:w-full"></div>
        </div>
        {description ? (
          <p className="text-[8px] text-gray-400">{description}</p>
        ) : (
          <></>
        )}
      </div>
    }
    </>
  );
}
